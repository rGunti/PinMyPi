const debug = require('debug')('PinMyPi:Routes:map');
const config = require('config');
const async = require('async');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const AuthUtils = require('../auth/utils');
const RouteUtils = require('../utils/route-utils');
const ensureLoggedIn = require('../auth/utils').ensureLoggedIn;
const Utils = require('../utils');
const ApiUtils = require('../utils/api');

const db = require('../db/models');
const Device = db.Device;
const Point = db.Point;

const router = require('express').Router();

router.get('/',
    ensureLoggedIn(),
    (req, res, next) => {
        Device.findAll({
            where: { owner_id: req.user.id }
        }).then((devices) => {
            return HandleRender.render(res, 'map', 'Device Map', {
                devices: devices
            });
        }).catch((err) => {
            console.error(err);
            next(err);
        });
    });

router.get('/update.ajax',
    ensureLoggedIn(),
    (req, res, next) => {
        Device.findAll({
            where: { owner_id: req.user.id }
        }).then((devices) => {
            let devicePositions = {};
            async.forEachOf(devices, (device, key, callback) => {
                Point.findOne({
                    where: { device_id: device.id },
                    order: [['createdAt', 'DESC']]
                }).then((point) => {
                    if (point) {
                        devicePositions[device.id] = point;
                    } else {
                        devicePositions[device.id] = null;
                    }
                    return callback();
                }).catch((err) => {
                    return callback(err);
                });
            }, (err) => {
                if (err) {
                    return ApiUtils.errorResponse(
                        res, 
                        'Failed to fetch current state', 
                        null, 
                        ApiUtils.HttpStatusCode.ServerError
                    );
                } else {
                    return ApiUtils.dataResponse(res, devicePositions);
                }
            })
        }).catch((err) => {
            console.error(err);
            next(err);
        });
    });

module.exports = {
    baseUri: "/map",
    handler: router
};
