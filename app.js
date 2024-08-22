var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");
const app = express();

const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/nucampsite";
// SET UP a connection
const connect = mongoose.connect(url, {});
// handle promise from connect method
connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("12345-6789-56789"));

function auth(req, res, next) {
  // Log the request headers to the console for debugging purposes
  // console.log(req.headers);

  // Check if the signed cookie 'user' is not present
  if (!req.signedCookies.user) {
    // Extract the 'Authorization' header from the request
    const authHeader = req.headers.authorization;

    // If the 'Authorization' header is missing, the user is not authenticated
    if (!authHeader) {
      // Create an error object with a message indicating authentication failure
      const err = new Error("You are not authenticated!");

      // Set the 'WWW-Authenticate' header to prompt the client for credentials
      res.setHeader("WWW-Authenticate", "Basic");

      // Set the status code to 401 (Unauthorized)
      err.status = 401;

      // Pass the error to the next middleware function
      return next(err);
    }

    // Decode the Base64-encoded credentials from the 'Authorization' header
    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");

    // Extract the username and password from the decoded credentials
    const username = auth[0];
    const password = auth[1];

    // Check if the provided username and password are correct
    if (username === "admin" && password === "password") {
      // Set a signed cookie named 'user' with the value 'admin'
      res.cookie("user", "admin", { signed: true });

      // If the credentials are correct, call the next middleware function
      return next(); // authorized
    } else {
      // If the credentials are incorrect, the user is not authenticated
      const err = new Error("You are not authenticated!");

      // Set the 'WWW-Authenticate' header to prompt the client for credentials again
      res.setHeader("WWW-Authenticate", "Basic");

      // Set the status code to 401 (Unauthorized)
      err.status = 401;

      // Pass the error to the next middleware function
      return next(err);
    }
  } else {
    // If the signed cookie 'user' is present and its value is 'admin', authorize the user
    if (req.signedCookies.user === "admin") {
      return next();
    } else {
      // If the cookie value is not 'admin', the user is not authenticated
      const err = new Error("You are not authenticated!");
      err.status = 401;
      return next(err);
    }
  }
}


// Use the 'auth' middleware function for all routes in the application
app.use(auth);

// Serve static content for the app from the "public" directory in the application directory
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/campsites", campsiteRouter);
app.use("/promotions", promotionRouter);
app.use("/partners", partnerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
