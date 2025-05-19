const isLoggedIn = (req, res, next) => {
    console.log('checking if user is logged in!');
    console.log('Session:', req.session);

    if (req.session && req.session.userId) {
        console.log('User is logged in, proceeding...');
        res.locals.user = req.session.user; // Set the user in locals
        next();
    } else {
        console.log('User is not logged in, redirecting to login page');
        res.redirect('/login');
    }
};

module.exports = {
    isLoggedIn
}