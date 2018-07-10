const debug = require('debug')('PinMyPi:Routes:map');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const AuthUtils = require('../auth/utils');
const RouteUtils = require('../utils/route-utils');
const ensureLoggedIn = require('../auth/utils').ensureLoggedIn;
const Utils = require('../utils');

const Device = require('../db/models').Device;

const router = require('express').Router();

router.get('/',
    ensureLoggedIn(),
    (req, res, next) => {
        return HandleRender.render(res, 'map', 'Device Map');
    });

module.exports = {
    baseUri: "/map",
    handler: router
};
