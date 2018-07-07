const debug = require('debug')('PinMyPi:Routes:user');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const AuthUtils = require('../auth/utils');
const RouteUtils = require('../utils/route-utils');
const ensureLoggedIn = require('../auth/utils').ensureLoggedIn;
const Utils = require('../utils');

const router = require('express').Router();

router.get('/',
    ensureLoggedIn(),
    (req, res, next) => {
        return HandleRender.render(res, 'devices/main', 'My Devices');
    });

module.exports = {
    baseUri: "/devices",
    handler: router
};
