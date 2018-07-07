const debug = require('debug')('PinMyPi:Routes:auth');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const RouteUtils = require('../utils/route-utils');
const Utils = require('../utils');
const RememberMeAuthentication = require('../auth/remember-me');

const router = require('express').Router();

router.get('/login', (req, res, next) => {
    HandleRender.render(res, 'login', 'Login', null, 'login');
});

router.post('/login',
    auth.authenticate('local', {
        successReturnToOrRedirect: RouteUtils.getRoute("/"),
        failureRedirect: RouteUtils.getRoute('/auth/login'),
        failureFlash: true
    }),
    (req, res, next) => {
        RememberMeAuthentication.whenEnabledAndChecked(
            req,
            () => {
                RememberMeAuthentication.issueToken(req.user, (err, token) => {
                    res.cookie('rememberMe', token, {
                        path: RouteUtils.getBasePath('/'),
                        httpOnly: false,
                        maxAge: config.get('auth.rememberMe.maxAge')
                    });
                    return next();
                });
            },
            next
        );
    },
    (req, res, next) => {
        res.redirect(RouteUtils.getRoute('/'));
    });

router.get('/logout', (req, res, next) => {
    RememberMeAuthentication.consumeToken(req.cookies['rememberMe']);
    res.clearCookie('rememberMe');
    req.logout();
    res.redirect(RouteUtils.getRoute('/'));
});

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    debug('Debug Routes have been enabled!');
    router.get('/debug.rememberme', (req, res, next) => {
        HandleRender.render(res, 'debug/loginTokens', '[DEBUG] Remember Me Tokens', {
            tokens: RememberMeAuthentication._getAllTokens()
        });
    });
}

module.exports = {
    baseUri: "/auth",
    handler: router
};
