var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const campsiteRouter = require("./routes/campsiteRouter");
const promotionRouter = require("./routes/promotionRouter");
const partnerRouter = require("./routes/partnerRouter");
const app = express();
const passport = require("passport");
const authenticate = require("./authenticate");

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
// app.use(cookieParser("12345-6789-56789"));

app.use(
  session({
    name: "session-id",
    secret: "12345-6789-56789",
    //when a session is made, and no updates are made, it will not be saved, no cookie will be sent to client
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);


function auth(req, res, next) {
  console.log(req.user);
  // Log the request headers to the console for debugging purposes
  // console.log(req.headers);

  // Check if the signed cookie 'user' is not present
  if (!req.user) {
    // Create an error object with a message indicating authentication failure
    const err = new Error("You are not authenticated!");

    // Set the 'WWW-Authenticate' header to prompt the client for credentials
    // res.setHeader("WWW-Authenticate", "Basic");

    // Set the status code to 401 (Unauthorized)
    err.status = 401;

    // Pass the error to the next middleware function
    return next(err);

   
  } else {
    // If the signed cookie 'user' is present and its value is 'admin', authorize the user
   
      return next();
    } 
  }


// Use the 'auth' middleware function for all routes in the application
app.use(auth);

// Serve static content for the app from the "public" directory in the application directory
app.use(express.static(path.join(__dirname, "public")));

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
