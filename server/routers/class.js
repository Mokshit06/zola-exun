const { Router } = require('express');
const Class = require('../models/Class');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/auth');

const router = Router();

router.get('/', ensureAuth, async (req, res, next) => {
  try {
    const userClass = await Class.findById(req.user.class);

    res.json(userClass);
  } catch (error) {
    next(error);
  }
});

router.post('/', ensureAuth, async (req, res, next) => {
  try {
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

module.exports = router;
