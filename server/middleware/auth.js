exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).send('Not logged in');
};

exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.status(400).send('Already Logged in');
  }

  next();
};
