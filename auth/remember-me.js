const config = require('config');
const debug = require('debug')('PinMyPi:Auth:RememberMe');
const Utils = require('./../utils');

const rememberMeTokens = {};

const RememberMeAuthentication = {
    saveToken: (token, uid, done) => {
        debug('Saving Token [%s..] ...', token.substr(0, 6));
        rememberMeTokens[token] = uid;
        return done();
    },
    consumeToken: (token, done) => {
        debug('Consuming Token [%s..] ...', token.substr(0, 6));
        var uid = rememberMeTokens[token];
        delete rememberMeTokens[token];
        return (done) ? done(null, uid) : null;
    },
    issueToken: (user, done) => {
        let token = Utils.randomString(64);
        debug('Issuing new token [%s..] ...', token.substr(0, 6));
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
    },
    _getAllTokens: () => {
        let r = [];
        for (let token in rememberMeTokens) {
            r.push({
                token: token,
                userId: rememberMeTokens[token]
            });
        }
        return r;
    }
};

module.exports = RememberMeAuthentication;
