const isLoggedIn = (req, res, next) => {
    console.log('checking if user is logged in!');
    if (req.body.user) {
    next();
    }
    
    else {
        res.redirect('login');
    };
};

module.exports = {
    isLoggedIn
}