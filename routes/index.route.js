const debug = require('debug')('PinMyPi:Routes:index');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');

const router = require('express').Router();

router.get('/', (req, res, next) => {
    debug(`Requested from ${req.ip}`);
    HandleRender.render(res, 'index', 'Home');
});

router.get('/json', (req, res) => {
    res.json({
        "Hello": "World"
    });
});

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    debug('Debug Routes have been enabled!');
    router.get('/exception', (req, res, next) => {
        throw new Error('This is a test exception');
    });
}

module.exports = {
    baseUri: "/",
    handler: router
};
