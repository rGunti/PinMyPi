const debug = require('debug')('PinMyPi:Routes:api');
const config = require('config');
const RouteUtils = require('../utils/route-utils');
const ApiUtils = require('../utils/api');
const Utils = require('../utils');
const loginWithApiKey = require('../auth/utils').loginWithApiKey;

const router = require('express').Router();

router.get('/alive',
    (req, res, next) => {
        ApiUtils.emptyResponse(res);
    });

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    debug('Debug Routes have been enabled!');
}

module.exports = {
    baseUri: "/api",
    handler: route
};
