const path = require('path');
const bcrypt = require('bcryptjs');
const user = require('../Models/user');
const User = require('../Models/user');
const Quiz = require('../Models/quiz');
const mongoose = require('mongoose');

const index = (req, res) => {
    res.render('index');
};

const create = (req, res) => {
    res.render('create');
};

const renderLogin = (req, res) => {
    res.render('login');
};

const renderRegister = (req, res) => {
    res.render('register');
};

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('An error occurred while logging out.');
            }
            console.log('User logged out successfully');
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('An error occurred while logging out.');
    }
};

const login = async (req, res) => {
    try {
        const existingUser = await user.findOne({ email: req.body.email });
        
        if (!existingUser) {
            console.log('User not found');
            return res.status(401).render('login', { error: 'Invalid email or password' });
        }

        console.log('Authenticating...');
        const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
        
        if (isPasswordValid) {
            // Set session variables
            req.session.userId = existingUser._id;
            req.session.user = existingUser;
            req.session.role = existingUser.role;
            
            console.log('Successfully logged in');
            return res.redirect('/');
        } else {
            console.log('Invalid password');
            return res.status(401).render('login', { error: 'Invalid email or password' });
        }
    } catch (error) {
        console.log('Login error:', error);
        return res.status(500).render('login', { error: 'An error occurred during login' });
    }
};

const register = async (req, res) => {
    try {
        if (req.body.password === req.body.confirmPassword) {
            const existingUser = await user.findOne({ email: req.body.email });

            if (!existingUser) {
                const newUser = await user.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: "User"
                });
                
                console.log("User registered");
                
                // Log in the user after registration
                req.session.userId = newUser._id;
                req.session.user = newUser;
                req.session.role = newUser.role;
                
                return res.redirect('/');
            } else {
                console.log('Email already exists');
                return res.render('register', { error: 'Email already exists' });
            }
        } else {
            console.log('Passwords do not match');
            return res.render('register', { error: 'Passwords do not match' });
        }
    } catch (error) {
        console.log('Registration error:', error);
        return res.status(500).render('register', { error: 'An error occurred during registration' });
    }
};

const saveQuiz = async (req, res) => {
    try {
        console.log('Received quiz submission:', req.body);

        const { name } = req.body;
        let { questions } = req.body;

        // Validate the quiz name
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).send('Quiz name is required.');
        }        // Validate questions array
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).send('A quiz must have at least one question.');
        }
        
        // Process each question to ensure it has the required fields
        questions = questions.map(question => {
            console.log('Processing question:', question);
            
            // Make sure we have an answer field from one of the potential sources
            if (!question.answer) {
                if (question.type === 'free' && question.freeAnswer) {
                    console.log('Found free answer:', question.freeAnswer);
                    question.answer = question.freeAnswer;
                } else if (question.type === 'truefalse' && question.tfAnswer) {
                    console.log('Found true/false answer:', question.tfAnswer);
                    question.answer = question.tfAnswer;
                } else if (question.type === 'multiplechoice' && question.choices && question.correctChoice !== undefined) {
                    const correctChoiceIndex = parseInt(question.correctChoice);
                    if (!isNaN(correctChoiceIndex) && question.choices && Array.isArray(question.choices) && question.choices[correctChoiceIndex]) {
                        console.log('Found multiple-choice answer:', question.choices[correctChoiceIndex]);
                        question.answer = question.choices[correctChoiceIndex];
                    } else {
                        console.log('Invalid multiple-choice answer. correctChoice:', question.correctChoice, 'choices:', question.choices);
                    }
                } else {
                    console.log('No matching answer found for question type:', question.type);
                }
            }
            
            // Validate the question has all required fields
            if (!question.text || !question.answer || !question.type) {
                console.error('Invalid question format:', JSON.stringify(question));
                throw new Error(`Invalid question format: ${JSON.stringify(question)}`);
            }
            
            // Return a clean question object with only the fields we need
            return {
                text: question.text,
                answer: question.answer,
                type: question.type,
                choices: question.type === 'multiplechoice' ? question.choices : undefined
            };
        });

        console.log('Processed questions:', questions);

        const newQuiz = await Quiz.create({
            name,
            questions,
            createdBy: req.session.userId,
        });

        console.log('Quiz created successfully:', newQuiz);
        res.redirect('/');
    } catch (error) {
        console.error('Error saving quiz:', error);
        res.status(500).send(`An error occurred while saving the quiz: ${error.message}`);
    }
};

const listQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();

        // Process scores to calculate average based on the first score per user
        quizzes.forEach(quiz => {
            if (quiz.scores && quiz.scores.length > 0) {
                const userScores = new Map();
                quiz.scores.forEach(score => {
                    if (!userScores.has(score.user.toString())) {
                        userScores.set(score.user.toString(), score.score); // Take the first score only
                    }
                });
                quiz.averageScore = Array.from(userScores.values()).reduce((sum, score) => sum + score, 0) / userScores.size;
            } else {
                quiz.averageScore = null;
            }
        });

        res.render('quizzes', { quizzes });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).send('An error occurred while fetching quizzes.');
    }
};

const playQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid quiz ID');
        }

        const quiz = await Quiz.findById(id).populate('scores.user', 'name', 'user');
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }
        res.render('game', { quiz });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).send('An error occurred while fetching the quiz.');
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).send('Answers are required and must be an array.');
        }

        let correctAnswers = 0;

        // Loop through the questions and compare answers
        quiz.questions.forEach((question, index) => {
            if (answers[index] && question.answer.toLowerCase() === answers[index].toLowerCase()) {
                correctAnswers++;
            }
        });

        // Calculate the score as a percentage
        const score = (correctAnswers / quiz.questions.length) * 100;

        // Save score if user is logged in
        if (req.session.userId) {
            quiz.scores.push({ user: req.session.userId, score });
            await quiz.save();
        }

        res.render('results', {
            quiz,
            userAnswers: answers,
            score,
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).send('An error occurred while submitting the quiz.');
    }
};

module.exports = {
    index,
    create,
    saveQuiz,
    listQuizzes,
    playQuiz,
    submitQuiz,
    renderLogin,
    renderRegister,
    logout,
    login,
    register,
};