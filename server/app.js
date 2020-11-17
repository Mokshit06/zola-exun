const express = require('express');
const morgan = require('morgan');
const routers = require('./routers');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { connection } = require('mongoose');
const passport = require('passport');
const initializePassport = require('./config/passport');
const cors = require('cors');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
}

initializePassport(passport);

app.use(
  session({
    secret: process.env.SECRET,
    store: new MongoStore({
      mongooseConnection: connection,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routers);

module.exports = app;
