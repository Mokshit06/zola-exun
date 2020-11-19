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

router.get('/:code', ensureAuth, async (req, res, next) => {
  try {
    const { code } = req.params;

    const meeting = await Meeting.findOne({ code }).populate('studentsPresent');

    if (!meeting) {
      return res.status(404).send({
        success: false,
        message: 'Meeting not found',
      });
    }

    if (
      JSON.stringify(meeting.class) !== JSON.stringify(req.user.class) &&
      !req.user.isAdmin
    ) {
      return res.status(404).send({
        success: false,
        message: 'You are not part of the class',
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
