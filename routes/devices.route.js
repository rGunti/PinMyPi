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

router.get('/new',
    ensureLoggedIn(),
    (req, res, next) => {
        return HandleRender.render(res, 'devices/edit', 'Register new device', {
            device: {
                id: null,
                name: '',
                key: null,
                createdAt: null,
                modifiedAt: null
            }
        });
    });

// GET /devices/123
//router.get(/\/\d.$/,
router.get('/:deviceId',
    ensureLoggedIn(),
    (req, res, next) => {
        Device.findOne({
            where: {
                owner_id: req.user.id,
                id: req.params.deviceId
            },
            raw: true
        }).then((device) => {
            if (device) {
                return HandleRender.render(res, 'devices/edit', `Edit device: ${device.name}`, {
                    device: device
                });
            } else {
                next(); // 404
            }
        });
    });

module.exports = {
    baseUri: "/devices",
    handler: router
};
