const express = require('express'),
  app = express(),
  path = require('path'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  flash = require('connect-flash'),
  index = require('./routes/index'),
  auth = require('./routes/account/auth');
  myaccount = require('./routes/account/myaccount'),
  products = require('./routes/products/products'),
  cart = require('./routes/cart/cart');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(session({
  secret: 's2cure',
  name: 'shopSession'
}));
app.use((req, res, next) => {
  res.locals.userid = req.session.userid;
  next();
});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extends: true}));
app.use(bodyParser.json());
app.use(flash());
app.use('/', index);
app.use('/auth', auth);
app.use('/myaccount', myaccount);
app.use('/products', products);
app.use('/cart', cart);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

module.exports = app;