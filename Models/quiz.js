const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    answer: { type: String, required: true },
    type: { type: String, enum: ['free', 'truefalse', 'multiplechoice'], required: true },
    choices: { type: [String], required: false }, // Array of choices for multiple-choice questions
});

const quizSchema = new mongoose.Schema({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

quizSchema.add({
    scores: [scoreSchema],
    questions: [questionSchema],
    name: { type: String, required: true },
});

module.exports = mongoose.model('Quiz', quizSchema);
