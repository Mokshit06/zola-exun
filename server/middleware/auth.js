exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: 'Not logged in', success: false });
};

exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res
      .status(400)
      .json({ message: 'Already Logged in', success: false });
  }

  next();
};
