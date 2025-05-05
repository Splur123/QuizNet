const path = require('path');
const bcrypt = require('bcryptjs');
const user = require('../Models/user');

const index = (req, res) =>{
    res.render('index');
};

const create = (req, res) =>{
    res.render('create');
};

const renderLogin = (req, res) =>{
    res.render('login');
};

const renderRegister = (req, res) =>{
    res.render('register');
};

const login = async (req, res) =>{
    const existingUser = await user.findOne({email: req.body.email});

            console.log('authenticating...');

            try {
            if ( await bcrypt.compare(req.body.password, existingUser.password)){
                req.session.userId = existingUser._id;
                req.session.user = existingUser;
                req.session.role = existingUser.role;
                console.log("successfully logged in");
                res.redirect('/');
            }
            else {
                res.status(201).send("couldn't find account");
            }
        }

            catch (error) {
                console.log(error);
            }
        };

const register = async (req, res) =>{
    try {
        if (req.body.password === req.body.confirmPassword ) {
            const existingUser = await user.findOne({email: req.body.email});

            if(!existingUser){
                await user.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    role: "User"
                })
                console.log("user registered");
                this.login
                res.redirect('/');
            }
            else {
                res.redirect('register');
            }

        } else {
            res.redirect('register');
        }
    }
    
    catch (error) {
            console.log(error);
        }
};

module.exports={
    index,
    create,
    renderLogin,
    renderRegister,
    login,
    register
};