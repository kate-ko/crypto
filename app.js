require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { DB } = process.env;

const routes = require('./routes')
const query = require('./query')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

query(`CREATE DATABASE IF NOT EXISTS ${DB}`, 0, function (err, result) {
  if (err) throw err;

  const sql = `CREATE TABLE IF NOT EXISTS ${DB}.rates (id INT AUTO_INCREMENT PRIMARY KEY, ticker VARCHAR(255), price DECIMAL(20,3), source VARCHAR(255), created DATETIME)`;

  query(sql, 0, function (err, result) {
    if (err) throw err;
  })
})

module.exports = app;
