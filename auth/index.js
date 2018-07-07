const debug = require('debug')('PinMyPi:Authentication');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LocalApiKeyStrategy = require('passport-localapikey').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;

const AuthUtils = require('../auth/utils');
const RememberMeAuthentication = require('./remember-me');

const db = require('../db/models');
const MUser = db.User;

debug('Setting up Local Auth Strategy ...');
passport.use(new LocalStrategy(
    (username, password, done) => {
        debug('Trying to authenticate %s ...', username);
        process.nextTick(() => {
            MUser.findOne({
                where: {
                    username: username,
                    passhash: AuthUtils.encodePassword(password)
                },
                plain: true
            }).then((user) => {
                if (!user) {
                    debug('Could not authenticate user %s (not found or wrong password)');
                    return done(null, false);
                }
                debug('Authenticated %s', username);
                return done(null, user);
            }).catch((err) => {
                debug('Failed to authenticate user %s', username);
                return done(err);
            });
        })
    }
));

RememberMeAuthentication.whenEnabled(() => {
    debug('Setting up Remember Me Strategy ...');
    passport.use(new RememberMeStrategy(
        (token, done) => {
            let logToken = `[${token.substr(0, 6)}..]`;
            debug('Trying to authenticate using Remember Me using Token %s ...', logToken);
            RememberMeAuthentication.consumeToken(token, (err, uid) => {
                if (err) return done(err);
                if (!uid) return done(null, false);

                MUser.findOne({
                    where: { id: uid },
                    plain: true
                }).then((user) => {
                    if (user) {
                        debug('Authenticated %s using Token %s', user.username, logToken);
                        return done(null, user);
                    }
                    debug('Could not authenticate using Token %s', logToken);
                    return done(null, false);
                }).catch((err) => {
                    debug('Failed to authenticate using Token %s', logToken);
                    done(err);
                });
            });
        },
        RememberMeAuthentication.issueToken
    ));
}, () => {
    debug('Remember Me Strategy is disabled.');
});

debug('Setting up (De)Serialization ...');
passport.serializeUser((user, callback) => {
    callback(null, user.id);
});

passport.deserializeUser((id, done) => {
    debug('Fetching user data for UserID=%s ...', id);
    MUser.findOne({
        where: { id: id },
        plain: true
    }).then((user) => {
        if (!user) return done(null, false);
        return done(null, user);
    }).catch((err) => {
        debug('Failed to fetch user data for UserID=%s', id);
        done(err);
    });
});

debug('Auth setup completed');
module.exports = passport;
