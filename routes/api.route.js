const debug = require('debug')('PinMyPi:Routes:api');
const config = require('config');
const RouteUtils = require('../utils/route-utils');
const ApiUtils = require('../utils/api');
const Utils = require('../utils');
const loginWithApiKey = require('../auth/utils').loginWithApiKey;

const db = require('../db/models');
const MUser = db.User;
const MDevice = db.Device;
const MPoint = db.Point;

const router = require('express').Router();

router.get('/alive',
    (req, res, next) => {
        ApiUtils.emptyResponse(res);
    });

const buildPointData = (req) => {
    return {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        altitude: req.body.altitude,
        epx: req.body.epx,
        epy: req.body.epy,
        epv: req.body.epv,
        speed: req.body.speed,
        time: req.body.gpsTime,
        additional: JSON.stringify(req.body.additional)
    };
};

router.post('/device/update',
    loginWithApiKey(),
    (req, res, next) => {
        const APIKEY = req.query.apikey || req.body.apikey;
        let device = MDevice.findOne({
            where: {
                owner_id: req.user.id,
                key: APIKEY
            }
        }).then((device) => {
            if (device) {
                let pointData = null;
                try {
                    pointData = buildPointData(req);
                    pointData.device_id = device.id;
                    let point = MPoint.build(pointData);
                    point.save()
                        .then(() => {
                            ApiUtils.emptyResponse(res);
                        })
                        .catch((err) => {
                            debug("Failed to save point.");
                            console.error(err);
                            ApiUtils.errorResponse(
                                res,
                                "Failed to save point.",
                                null,
                                ApiUtils.HttpStatusCode.ServerError
                            )
                        });
                } catch (err) {
                    console.error(err);
                    return ApiUtils.errorResponse(
                        res, 
                        "Your request was malformed and was rejected.", 
                        null, 
                        ApiUtils.HttpStatusCode.BadRequest
                    );
                }
            } else {
                debug("Could not find requested device.");
                return ApiUtils.errorResponse(
                    res, 
                    "The device could not be found.", 
                    null, 
                    ApiUtils.HttpStatusCode.NotFound
                );
            }
        }).catch((err) => {
            debug("Failed to fetch device.");
            console.error(err);
            return ApiUtils.errorResponse(
                res, 
                "The device could not be found.", 
                null, 
                ApiUtils.HttpStatusCode.NotFound
            );
        });
    });

if (config.has('server.enableDebugRoutes') && config.get('server.enableDebugRoutes')) {
    debug('Debug Routes have been enabled!');
}

module.exports = {
    baseUri: "/api",
    handler: router
};
