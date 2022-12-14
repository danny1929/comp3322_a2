var cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var monk = require("monk");
var db = monk("127.0.0.1:27017/assignment2");
var notesRouter = require("./routes/notes");
var app = express();

app.use(
  session({
    secret: "random_string_goes_here",
    resave: true,
    saveUninitialized: true,
  })
);

var corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  req.db = db;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use("/", notesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//module.exports = app;
app.listen(3001);
