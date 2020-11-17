const { Router } = require('express');
const { ensureGuest, ensureAuth } = require('../middleware/auth');
const passport = require('passport');

const router = Router();

router.get('/me', ensureAuth, (req, res) => {
  res.send(req.user);
});

router.get(
  '/login',
  ensureGuest,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/auth/success');
  }
);

router.get('/success', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Login Successful</title>
    </head>
    <body>
      <h1>Authorized</h1>
      <p>You can close this window now</p>
      <script>
        let originUrl = window.location.origin;
        if (window.location.hostname === 'localhost') {
          originUrl = 'http://localhost:3000'
        }
        window.opener.postMessage('success', originUrl);
        window.close();
      </script>
    </body>
  </html>
  `);
});

router.post('/logout', (req, res) => {
  req.logout();
  res.send('Logged out');
});

module.exports = router;
