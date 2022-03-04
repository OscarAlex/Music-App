const express= require('express');
const passport= require('passport');
const router= express.Router();

const User= require('../models/user');
const Label= require('../models/label');
const Track= require('../models/track');
const Playlist= require('../models/playlist-track');

//Index page
router.get('/', async (req, res, next) => {
    //Get playlist
    const playlist= await Playlist.find();
    res.render('index', {playlist});
});

//About
router.get('/about', (req, res, next) => {
    res.render('about');
});

//Sign up
router.get('/signup', isNotAuthenticated, (req, res, next) => {
    res.render('signup');
});

//The local-signup function we created is used
router.post('/signup', isNotAuthenticated, checkPasswordSU, passport.authenticate('local-signup', {
    //If success signing up, redirect to profile
    successRedirect: '/',
    //If not, redirect to sign up
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//If no password
function checkPasswordSU(req, res, next){   
    if(!req.body.name){
        //Else, redirect to sign in
        req.flash('signupMessage', 'Write a name');
        res.locals.signupMessage= req.flash('signupMessage');

        res.render('signup');
    }
    else if(!req.body.password){
        //Else, redirect to sign in
        req.flash('signupMessage', 'Write a password');
        res.locals.signupMessage= req.flash('signupMessage');

        res.render('signup');
    }
    else if(!req.body.password2){
        //Else, redirect to sign in
        req.flash('signupMessage', 'Confirm your password');
        res.locals.signupMessage= req.flash('signupMessage');

        res.render('signup');
    }
    else if(req.body.password != req.body.password2){
        //Else, redirect to sign in
        req.flash('signupMessage', 'Passwords do not match');
        res.locals.signupMessage= req.flash('signupMessage');

        res.render('signup');
    }
    else{
        return next();
    }
}

//Sign in
router.get('/signin', isNotAuthenticated, (req, res, next) => {
    res.render('signin');
});

router.post('/signin', isNotAuthenticated, checkPasswordSI, passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

//If no password
function checkPasswordSI(req, res, next){
    if(!req.body.email){
        req.flash('signinMessage', 'Write an email');
        res.locals.signinMessage= req.flash('signinMessage');

        res.render('signin');
    }
    else if(!req.body.password){
        req.flash('signinMessage', 'Write a password');
        res.locals.signinMessage= req.flash('signinMessage');

        res.render('signin');
    }
    else{
        return next();
    }
}

//Change password
router.get('/change_password', isAuthenticated, (req, res, next) => {
    res.render('change_pass');
});

router.post('/change_password', isAuthenticated, async (req, res, next) => {
    //Get passwords
    const old_password= req.body.old;
    const new_password= req.body.new;

    //Get user
    const user= await User.findOne({email: req.user.email});
    
    //If no passwords
    if(old_password == '' || new_password == ''){
        req.flash('changesMessage', 'Write a password');
        res.locals.changesMessage= req.flash('changesMessage');

        res.render('change_pass');
    }
    //If old password not matching
    else if(!user.comparePassword(old_password)){
        req.flash('changesMessage', 'Old password does not match');
        res.locals.changesMessage= req.flash('changesMessage');

        res.render('change_pass');
    }
    //If no errors
    else{
        req.flash('changesMessage', 'Password updated successfully');
        await User.findByIdAndUpdate(user.id, {password: user.encryptPassword(new_password)});

        res.redirect('/profile');
    }
});

//Change name
router.get('/change_name', isAuthenticated, (req, res, next) => {
    res.render('change_name');
});

router.post('/change_name', isAuthenticated, async (req, res, next) => {
    //Get new name
    const new_name= req.body.new;

    //If no name
    if(new_name == ''){
        req.flash('changesMessage', 'Write a username');
        res.locals.changesMessage= req.flash('changesMessage');

        res.render('change_name');
    }
    //If no errors
    else{
        req.flash('changesMessage', 'Name updated successfully');
        await User.findByIdAndUpdate(req.user.id, {name: new_name});

        res.redirect('/profile');
    }
});

//Forgotten password
router.get('/forgotten_password', isNotAuthenticated, (req, res, next) => {
    res.render('forgot_password');
});

//Log out
//End session
router.get('/logout', isAuthenticated, (req, res, next) => {
    req.logout();
    res.redirect('/');
});

//Middleware, the routes next to it need to be authenticated
/*router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});*/

//Profile
//If the user is authenticated, continue
router.get('/profile', isAuthenticated, async (req, res, next) => {
    //Search and send tracks and labels
    const labels= await Label.find();
    const tracks= await Track.find();

    res.render('profile', {labels, tracks});
});

router.get('/music', isAuthenticated, async (req, res, next) => {
    //Search and send labels
    const labels= await Label.find();
    const tracks= await Track.find();
    const playlist= await Playlist.find();
    res.render('mymusic', {labels, tracks, playlist});
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

//If the user is not authenticated, continue
function isNotAuthenticated(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    //Else, redirect to main page
    res.redirect('/');
}

module.exports = router;