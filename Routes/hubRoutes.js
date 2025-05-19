const router = require('express').Router();

const {
    index,
    create,
    renderLogin,
    renderRegister,
    logout,
    login,
    register,
    saveQuiz,
    listQuizzes,
    playQuiz,
    submitQuiz
} = require('../Controllers/hubController');

const {
    isLoggedIn
} = require('../Middleware/auth');


router.get('/', index);
router.get('/create', isLoggedIn, create);
router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/logout', logout);
router.get('/quizzes', listQuizzes);
router.get('/game/:id', playQuiz);

router.post('/register', register);
router.post('/login', login);
router.post('/quizzes', isLoggedIn, saveQuiz);
router.post('/submit/:id', isLoggedIn, submitQuiz);

module.exports = router;