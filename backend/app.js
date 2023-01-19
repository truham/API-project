// import packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

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

module.exports = app;