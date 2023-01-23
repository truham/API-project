// import packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { ValidationError } = require('sequelize');

// true if env in prod or not by checking env key in config file (backend/config/index.js)
const { environment } = require('./config');
const isProduction = environment === 'production';

const routes = require('./routes');

// initialize express app
const app = express();

// connect middleware for logging info about req and res
app.use(morgan('dev'));

// parse cookies
app.use(cookieParser());

// parse JSON bodies of reqs (content-type: application/json)
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  
// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

app.use(routes); // Connect all the routes

// PHASE 2 - ERROR HANDLERS
// catch unhandled reqs and forward to error handler
// any time there is no route provided for example
// underscores below are never used; just stylistic choice
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

// Error formatter - actually sends response back to client
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err); // also to ourselves in terminal to see what error we're running into
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;