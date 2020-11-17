const { Router } = require('express');
const authRouter = require('./auth');

const router = Router();

router.get('/', (req, res) => {
  res.send('API running');
});

router.use('/auth', authRouter);

module.exports = router;
