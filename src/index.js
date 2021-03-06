const express= require('express');
const engine= require('ejs-mate');
const path= require('path');
const morgan= require('morgan');
const passport= require('passport');
const session= require('express-session');
const flash= require('connect-flash');
const {session_s}= require('./keys');
//Inits
const app= express();
require('./database');
require('./controllers/local-auth');

//Settings
//__dirname returns path until src
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '0.0.0.0');

//Middlewares (Functions before routes)
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: session_s.secret,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    //app.locals means a variable that is available in the whole app
    app.locals.signupMessage= req.flash('signupMessage');
    app.locals.signinMessage= req.flash('signinMessage');
    app.locals.changesMessage= req.flash('changesMessage');
    app.locals.labelMessage= req.flash('labelMessage');
    app.locals.trackMessage= req.flash('trackMessage');
    //Get user info
    app.locals.user= req.user;
    app.locals.isAuthenticated= req.isAuthenticated();
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/crud-lbl-trck'));
app.use('/', require('./routes/play-music'));

//Start server
app.listen(app.get('port'), app.get('host'), () => {
    console.log('Server on port', app.get('port'));
})