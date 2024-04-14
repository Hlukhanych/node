var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { authenticationCheck } = require('./middlewares/auth.middleware');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
let ordersRouter = require('./routes/orders');
let my_usersRouter = require('./routes/my_users')
let authRouter = require('./routes/auth.route')

var app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toUTCString()}] ${req.method}: ${req.path}`);
  next();
});

// An endpoint to hadle base url route GET request
app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    data: {
      message: "Node.js ExApp"
    }
  })
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/my_users', my_usersRouter)
app.use('/auth', authRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  const erorrStatus = err.status || 500;
  console.error(`${'\x1b[31m'}[${new Date().toUTCString()}] ${req.method}: ${req.path}. Error(${erorrStatus}): ${err.message}`, '\x1b[0m');
  res.status(erorrStatus).send({
    status: erorrStatus,
    error: err
  });
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
