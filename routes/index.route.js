const debug = require('debug')('PinMyPi:Routes:index');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const ensureLoggedIn = require('../auth/utils').ensureLoggedIn;
const ApiUtils = require('../utils/api');

const router = require('express').Router();

router.get('/',
    ensureLoggedIn(),
    (req, res, next) => {
        debug(`Requested from ${req.ip}`);
        HandleRender.render(res, 'index', 'Home');
    });

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    debug('Debug Routes have been enabled!');
    router.get('/exception', (req, res, next) => {
        throw new Error('This is a test exception');
    });

    router.get('/teapot', (req, res, next) => {
        ApiUtils.dataResponse(
            res,
            'I\'m a teapot!',
            ApiUtils.HttpStatusCode.Teapot
        );
    });
}

module.exports = {
    baseUri: "/",
    handler: router
};
