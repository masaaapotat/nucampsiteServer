const express = require("express");

const User = require("../models/user");

const router = express.Router();
const passport = require("passport");
const authenticate = require("../authenticate");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Route for user signup
router.post("/signup", (req, res) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          console.error("Error during user registration:", err); // Log the error
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: false, err: err.message }); // Send a more detailed error message
          return;
        }
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    );
  });
  

// Route for user login
router.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// Route for user logout
router.get("/logout", (req, res, next) => {
  // Check if the user is authenticated and has a session
  if (req.session) {
    req.session.destroy(); // Destroy the session to log the user out
    res.clearCookie("session-id"); // Clear the session cookie
    res.redirect("/"); // Redirect the user to the home page
  } else {
    // If the user is not logged in, send an error response
    const err = new Error("You are not logged in!");
    err.status = 401; // 401 Unauthorized status code
    return next(err);
  }
});

module.exports = router;
