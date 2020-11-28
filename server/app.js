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

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
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
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routers);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  res.json({ success: false, message: err.message });
});

module.exports = app;
