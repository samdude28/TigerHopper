// (2) Env: so we can access our Twitter API information.
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var env = require('./env');

module.exports = function(passport) {
    // serialize user into the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('twitter', new TwitterStrategy({
        consumerKey: env.consumerKey,
        consumerSecret: env.consumerSecret,
        callbackUrl: env.callbackUrl
    }, function(token, secret, profile, done) {
        process.nextTick(function() {
            User.findOne({
                'twitter.id': profile.id
            }, function(err, user) {
                if (err) return done(err);

                // If the user already exists, just return that user.
                if (user) {
                    return done(null, user);
                }
                else {
                    // Otherwise, create a brand new user using information passed from Twitter.
                    var newUser = new User();

                    // Here we're saving information passed to us from Twitter.
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            })
        })
    }));
}
