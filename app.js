var createError = require('http-errors');
var session=require('express-session')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload=require('express-fileupload')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var hbs=require('express-handlebars')
var app = express();
var db=require('./config/connection')//connect bfr router
const nocache = require('nocache');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:'Key',cookie:{maxAge:6000000}}))
app.use(nocache());
db.connect((err)=>{
  if(err)
    console.log("Not connected")
  else
    console.log("Connection Success")
})
app.use('/', userRouter);
app.use('/admin', adminRouter);

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
app.get('/place-order', (req, res) => {
  const userId = req.session.user._id; // Assuming userId is stored in session
  res.render('place-order', { userId });
});

// POST route to handle form submission
app.post('/place-order', (req, res) => {
  console.log(req.body); // To check the form data in the server console
  res.json({ status: true, message: 'Order placed successfully' });
});


module.exports = app;
