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

exports.ensureStudent = (req, res, next) => {
  if (req.user.isTeacher) {
    return res.status(401).send({
      message: 'You are not a student',
      success: false,
    });
  }

  next();
};

exports.ensureTeacher = (req, res, next) => {
  if (!req.user.isTeacher) {
    return next();
  }

  return res.status(401).send({
    message: 'You are not a teacher',
    success: false,
  });
};
