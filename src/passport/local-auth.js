const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;

//Schema for the users
const User= require('../models/user');

//Save data for login
//Every time you navegate between pages, check if the user exits
//by id
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user= await User.findById(id);
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    //Validate if user already exits
    const user= await User.findOne({email: email});
    if(user){
        //Return message
        return done(null, false, req.flash('signupMessage', 'The email already exists'));
    }
    else{
        const newUser= new User();
        newUser.email= email;
        newUser.password= newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    //Validate if user exits
    const user= await User.findOne({email: email});
    //If does not exit
    if(!user){
        return done(null, false, req.flash('signinMessage', 'The user does not exit'));
    }
    //Compare password
    if(!user.comparePassword(password)){
        return done(null, false, req.flash('signinMessage', 'Password incorrect'));
    }
    //If everything ok, return user
    done(null, user);
}));