const { Router } = require('express');
const authRouter = require('./auth');
const weatherRouter = require('./weather');

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});

router.use('/auth', authRouter);
router.use('/api/weather', weatherRouter);

module.exports = router;
