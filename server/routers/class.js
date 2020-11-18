const { Router } = require('express');
const Class = require('../models/Class');
const User = require('../models/User');
const {
  ensureAuth,
  ensureTeacher,
  ensureStudent,
} = require('../middleware/auth');

const router = Router();

router.get('/', ensureAuth, async (req, res, next) => {
  try {
    const userClass = await Class.findById(req.user.class);

    res.json(userClass);
  } catch (error) {
    next(error);
  }
});

router.post('/', ensureAuth, ensureTeacher, async (req, res, next) => {
  try {
    if (req.user.class) {
      return res.json({
        success: false,
        message: 'You can create only one class',
      });
    }

    const { grade, section } = req.body;

    if (!grade || !section) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const userClass = await Class.create({
      grade,
      section,
      teacher: req.user.id,
    });

    req.user.class = userClass.id;
    await req.user.save();

    res.json({
      code: userClass.code,
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/join', ensureAuth, ensureStudent, async (req, res, next) => {
  try {
    if (req.user.class) {
      return res.status(400).json({
        success: false,
        message: 'You are already part of a class',
      });
    }

    const userClass = await Class.findOne({ code: req.body.code });

    if (!userClass) {
      return res.status(404).json({
        success: false,
        message: "Class doesn't exist",
      });
    }

    req.user.class = userClass.id;
    await req.user.save();

    res.json({
      success: true,
      message: `Joining ${userClass.grade}${userClass.section}`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
