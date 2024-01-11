const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../modules/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async function (accessToken, refreshToken, profile, cb) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return cb(err, user);
        // });
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            cb(null, user);
          } else {
            user = await User.create(newUser);
            cb(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );

  /* the comment lines are provided by the passport document */
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
    User.findById(id)
      .then((user) => cb(null, user))
      .catch((err) => {
        console.log('===============' + err);
        cb(err, null);
      });
  });
};
