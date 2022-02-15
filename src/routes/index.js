const express= require('express');
//const req = require('express/lib/request');
//const res = require('express/lib/response');
const router= express.Router();
const passport= require('passport');

const Label= require('../models/label');
const Track= require('../models/track');
const Playlist= require('../models/playlist-track');

//Index page
router.get('/', async (req, res, next) => {
    //Get playlist
    const playlist= await Playlist.find();
    res.render('index', {playlist});
});

//Sign up
router.get('/signup', isNotAuthenticated, (req, res, next) => {
    res.render('signup');
});

//The local-signup function we created is used
router.post('/signup', passport.authenticate('local-signup', {
    //If success signing up, redirect to profile
    successRedirect: '/',
    //If not, redirect to sign up
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//Sign in
router.get('/signin', isNotAuthenticated, (req, res, next) => {
    res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
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
/*router.use((req, res, next) => {
    isAuthenticated(req, res, next);
    next();
});*/

//Profile
//If the user is authenticated, continue
router.get('/profile', async (req, res, next) => {
    //Search and send tracks and labels
    const labels= await Label.find();
    const tracks= await Track.find();
    
    res.render('profile', {labels, tracks});
});

router.get('/music', async (req, res, next) => {
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