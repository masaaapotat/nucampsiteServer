const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Importing the local strategy from Passport for local authentication
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const User = require("./models/user");

const config = require("./config");

// Creating a new instance of LocalStrategy for Passport to use.
// `User.authenticate()` is a method provided by the 'passport-local-mongoose' plugin, which adds a method to the User model to authenticate users.
exports.local = passport.use(new LocalStrategy(User.authenticate()));

// Serialize the user information to store in the session.

passport.serializeUser(User.serializeUser());

// Deserialize the user information from the session to restore the user object.

passport.deserializeUser(User.deserializeUser());


// This function generates a JWT (JSON Web Token) for a given user. The token is signed using the user's information and a secret key, and it expires in 3600 seconds (1 hour).
exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 3600, // Token expiration time set to 1 hour
  });
};

// Options object for configuring the JWT strategy
const opts = {};
// Extract the JWT from the Authorization header as a Bearer token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// The secret key used to verify the JWT's signature
opts.secretOrKey = config.secretKey;

// Configuring Passport to use the JWT strategy
exports.jwtPassport = passport.use(
  new JwtStrategy(
    opts, // Options for the strategy
    (jwt_payload, done) => {
      // Callback function to execute when the token is decoded
      console.log("JWT payload:", jwt_payload); // Log the decoded JWT payload

      // Find the user in the database by the ID stored in the JWT payload
      User.findOne({ _id: jwt_payload._id })
        .then((user) => {
          if (user) {
            // If user is found, return the user object
            return done(null, user);
          } else {
            // If user is not found, return false indicating authentication failed
            return done(null, false);
          }
        })
        .catch((err) => done(err, false)); // Handle any errors that occur during the process
    }
  )
);

// Middleware function to verify the user using the JWT strategy. This will be used to protect routes that require authentication.
exports.verifyUser = passport.authenticate("jwt", { session: false });
