const { Router } = require('express');
const { ensureGuest, ensureAuth } = require('../middleware/auth');
const passport = require('passport');

const router = Router();

router.get('/me', ensureAuth, (req, res) => {
  res.send(req.user);
});

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

router.get('/:provider', ensureGuest, (req, res, next) => {
  const provider = req.params.provider;

  if (!/^(google|discord)$/.test(provider)) {
    return res.json({
      message: 'Provider not supported',
      success: false,
    });
  }

  let scope = ['email'];

  if (provider === 'google') {
    scope = [...scope, 'profile'];
  } else {
    scope = [...scope, 'identify'];
  }

  passport.authenticate(provider, {
    scope,
  })(req, res, next);
});

router.get(
  '/:provider/callback',
  (req, res, next) => {
    const provider = req.params.provider;

    if (!/^(google|discord)$/.test(provider)) {
      return res.json({
        message: 'Provider not supported',
        success: false,
      });
    }

    passport.authenticate(provider, {
      failureRedirect: '/',
    })(req, res, next);
  },
  (req, res) => {
    res.redirect('/auth/success');
  }
);

router.post('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out', success: true });
});

module.exports = router;
