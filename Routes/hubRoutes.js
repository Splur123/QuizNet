const router = require('express').Router();

const {
    index,
    create,
    renderLogin,
    renderRegister,
    login,
    register
} = require('../Controllers/hubController');

const {
    isLoggedIn
} = require('../Middleware/auth');


router.get('/', index);
router.get('/create', isLoggedIn, create);
router.get('/login', renderLogin);
router.get('/register', renderRegister);

router.post('/register', register);
router.post('/login', login);

module.exports = router;