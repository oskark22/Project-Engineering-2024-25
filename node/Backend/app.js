var createError = require('http-errors');                           // http-errors: A module that helps you create HTTP error objects (like 404 Not Found).
var express = require('express');                                   // Web framework to handle routes, middleware, and server logic.
var path = require('path');                                         // A Node.js module to work with file and directory paths
var logger = require('morgan');                                     //  morgan: Logging middleware to log HTTP requests

var indexRouter = require('./routes/index');                        // indexRouter: Imports your main router from routes/index.js
var hbs = require('express-handlebars');                            // express-handlebars: Handlebars view engine integration for Express

var app = express();


// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware Setup
app.use(logger('dev'));                                             // Logs incoming HTTP requests in dev format                                       
app.use(express.json());                                            // Parses incoming JSON data

app.use('/', indexRouter);                                          // All routes starting with / are handled by indexRouter

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
