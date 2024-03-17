const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require("express-rate-limit");

const varietiesRoute = require('./routes/varieties');
const quizRoute = require('./routes/quiz');
const mailRoute = require('./routes/mail');
const glassesRoute = require('./routes/glasses');

const app = express();

//REQUEST PARSING
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

//ENABLING CROSS-ORIGIN-RESOURCE-SHARING
app.use(cors());

//LOGGER MIDDLEWARE
app.use(morgan('tiny'));

//COMPRESSION MIDDLEWARE FOR ALL ROUTES
app.use(compression());

//SETTING HTTP HEADERS
app.use(helmet({
    crossOriginResourcePolicy: false,
  }));

//RATE LIMIT MIDDLEWARE
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});
app.use(limiter);

//API ROUTES
app.use('/api/varieties', varietiesRoute);
app.use('/api/quiz', quizRoute);
app.use('/api/mail', mailRoute);
app.use('/api/glasses', glassesRoute);
app.use('/api/public', express.static('public'));   

//UNDEFINED ROUTE ERROR HANDLER
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//GENERAL ERROR HANDLER
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;