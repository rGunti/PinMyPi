const debug = require('debug')('PinMyPi:Routes:user');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const RouteUtils = require('../utils/route-utils');
const ensureLoggedIn = require('../auth/utils').ensureLoggedIn;
const Utils = require('../utils');

const router = require('express').Router();

router.get('/',
    ensureLoggedIn(),
    (req, res, next) => {
        return HandleRender.render(res, 'user/main', 'User Settings: Password');
    });

router.get('/keys',
    ensureLoggedIn(),
    (req, res, next) => {
        return HandleRender.render(res, 'user/keys', 'User Settings: API Keys');
    });

module.exports = {
    baseUri: "/me",
    handler: router
};
