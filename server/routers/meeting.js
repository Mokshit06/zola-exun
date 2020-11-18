const { Router } = require('express');
const { ensureAuth, ensureTeacher } = require('../middleware/auth');
const Meeting = require('../models/Meeting');
const mongoose = require('mongoose');

const router = Router();

router.get('/', ensureAuth, async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      class: req.user.class,
    });

    res.json(meetings);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', ensureAuth, async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    const meeting = await Meeting.findById(id).populate('studentsPresent');

    if (!meeting) {
      return res.status(404).send({
        success: false,
        message: 'Meeting not found',
      });
    }

    res.json(meeting);
  } catch (error) {
    next(error);
  }
});

router.post('/', ensureAuth, ensureTeacher, async (req, res, next) => {
  try {
    const meeting = await Meeting.create({ class: req.user.class });

    res.json(meeting);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
