import dotenv from 'dotenv'
import express from 'express';
import passport,{Passport} from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import expressSession from 'express-session';

const app = express();

// Google playground details
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Passport configuration

passport.use(new GoogleStrategy({
    clientID : GOOGLE_CLIENT_ID,
    clientSecret : GOOGLE_CLIENT_SECRET,
    callbackURL : '/google'
}, (accessToken, refreshToken, profile, callback) => {
    callback(null, profile)
    }
));

passport.serializeUser((user,callback) => {
    callback(null,user)
});
passport.deserializeUser((user,callback) => {
    callback(null,user)
});


// express-session configuration

app.use(expressSession({
    secret : 'authsecret',
    resave : true,
    saveUninitialized : true
}));


// initialiting Passport and Passport session
app.use(passport.initialize());
app.use(passport.session());


// routes setup

app.get('/login/google', passport.authenticate('google', {scope : ['profile email']}) );

app.get('/google', passport.authenticate('google'), (req,res) => { res.redirect('/user/profile') });

app.get('/user/profile', (req,res) => {
    res.send(req.user
        // ? req.user
        ? `Name : ${req.user.displayName}` &&  `Email : ${req.user.emails[0]}`
        : " Login with Google Account!! ")
})

app.get('/logout', (req,res) => {
    req.logOut();
    res.redirect('/')
});



// Listening
app.listen(1000,()=>{
    console.log("Server started on PORT : 1000");
})