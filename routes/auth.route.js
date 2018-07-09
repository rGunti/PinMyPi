const debug = require('debug')('PinMyPi:Routes:auth');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const RouteUtils = require('../utils/route-utils');
const Utils = require('../utils');
const RememberMeAuthentication = require('../auth/remember-me');
const loginWithApiKey = require('../auth/utils').loginWithApiKey;

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

router.get('/api/failed', (req, res, next) => {
    res.status(401);
    HandleRender.render(res, 'err/401-api', 'Failed to authenticate using API key', null, 'login');
});

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    debug('Debug Routes have been enabled!');
    router.get('/debug.rememberme', (req, res, next) => {
        HandleRender.render(res, 'debug/loginTokens', '[DEBUG] Remember Me Tokens', {
            tokens: RememberMeAuthentication._getAllTokens()
        });
    });

    router.get('/debug.apiauth',
        loginWithApiKey(),
        (req, res, next) => {
            return res.json({
                ok: true,
                user: req.user,
                query: req.query
            });
        });
}

module.exports = {
    baseUri: "/auth",
    handler: router
};
