const config = require('config');
const Utils = require('./../utils');

const rememberMeTokens = {};

const RememberMeAuthentication = {
    saveToken: (token, uid, done) => {
        rememberMeTokens[token] = uid;
        return done();
    },
    consumeToken: (token, done) => {
        var uid = rememberMeTokens[token];
        delete rememberMeTokens[token];
        return done(null, uid);
    },
    issueToken: (user, done) => {
        let token = Utils.randomString(64);
        RememberMeAuthentication.saveToken(token, user.id, (err) => {
            if (err) return done(err);
            return done(null, token);
        });
    },
    whenEnabled: (yes, no) => {
        if (config.get('auth.rememberMe')) return yes();
        return no();
    },
    whenEnabledAndChecked: (req, yes, no) => {
        if (req.body.rememberMe) return RememberMeAuthentication.whenEnabled(yes, no);
        return no();
    }
};

module.exports = RememberMeAuthentication;
