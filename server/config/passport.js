const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

module.exports = passport => {
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const newUser = {
          socialId: profile.id,
          name: profile.displayName,
          image: profile.photos[0].value,
          email: profile.emails[0].value,
          provider: profile.provider,
        };

        try {
          let user = await User.findOneAndUpdate(
            { socialId: profile.id },
            newUser,
            { new: true }
          );

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: '/auth/discord/callback',
        scope: ['identify', 'email'],
        prompt: 'consent',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const userDefaultAvatar = `https://cdn.discordapp.com/embed/avatars/${
          parseInt(profile.discriminator) % 5
        }.png`;

        const newUser = {
          socialId: profile.id,
          provider: profile.provider,
          name: profile.username,
          image: profile.avatar || userDefaultAvatar,
          email: profile.email,
        };

        try {
          let user = await User.findOneAndUpdate(
            { socialId: profile.id },
            newUser,
            { new: true }
          );

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};
