const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../modules/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        console.log(profile);
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    // process.nextTick(function () {
    //   return cb(null, {
    //     id: user.id,
    //     username: user.username,
    //     picture: user.picture,
    //   });
    // });
    cb(null, user.id);
  });

  passport.deserializeUser(function (id, cb) {
    // process.nextTick(function () {
    //   return cb(null, user);
    // });
    User.findById(id, (err, user) => cd(err, user));
  });
};
