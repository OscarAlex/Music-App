const express= require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router= express.Router();
const passport= require('passport');

//Index
router.get('/', (req, res, next) => {
    res.render('index');
});

//Sign up
router.get('/signup', (req, res, next) => {
    res.render('signup')
});

//The local-signup function we created is used
router.post('/signup', passport.authenticate('local-signup', {
    //If success signing up, redirect to profile
    successRedirect: '/profile',
    //If not, redirect to sign up
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//Sign in
router.get('/signin', (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

//Log out
//End session
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

//Middleware, the routes next to it need to be authenticated
router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});

//Profile
//If the user is authenticated, continue
router.get('/profile', (req, res, next) => {
    res.render('profile')
});

//Middleware
//If the user is authenticated, continue
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    //If not, redirect to main page
    res.redirect('/');
};

module.exports = router;