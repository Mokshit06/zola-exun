const { Router } = require('express');
const User = require('../models/User');
const authRouter = require('./auth');
const weatherRouter = require('./weather');

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});

router.use('/auth', authRouter);
router.use('/api/weather', weatherRouter);

router.get('/api/teachers', async (req, res) => {
  const teachers = await User.find({
    $or: [{ isTeacher: true }, { isAdmin: true }],
  });

  res.json(teachers);
});

module.exports = router;
