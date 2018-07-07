const debug = require('debug')('PinMyPi:Routes:user');
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
        Device.findAll({
            where: {
                owner_id: req.user.id
            },
            raw: true
        }).then((devices) => {
            return HandleRender.render(res, 'devices/main', 'My Devices', {
                devices: devices, 
                deviceCount: (devices) ? devices.length : 0
            });
        });
    });

module.exports = {
    baseUri: "/devices",
    handler: router
};
