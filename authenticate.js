const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy; // Importing the local strategy from Passport for local authentication
const User = require('./models/user'); 

// Creating a new instance of LocalStrategy for Passport to use.
// `User.authenticate()` is a method provided by the 'passport-local-mongoose' plugin, which adds a method to the User model to authenticate users.
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// Serialize the user information to store in the session.

passport.serializeUser(User.serializeUser());

// Deserialize the user information from the session to restore the user object.

passport.deserializeUser(User.deserializeUser());
