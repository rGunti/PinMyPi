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

const successMessages = {
    '1': 'Your changes have been saved successfully.',
    '2': 'Your device key has been reset successfully. Please reconfigure your device to use this key.',
    '3': 'Your device has been created.'
};

const renderDeviceScreen = (req, res, title, device, err) => {
    return HandleRender.render(res, 'devices/edit', title, {
        device: device,
        error: err,
        success: (req.query.success) ? successMessages[req.query.success] : null
    });
};

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
                return renderDeviceScreen(req, res, `Edit device: ${device.name}`, device);
            } else {
                next(); // 404
            }
        });
    });

router.post('/new',
    ensureLoggedIn(),
    (req, res, next) => {
        let device = Device.build({
            name: req.body['device.name'] || null,
            owner_id: req.user.id,
            key: Utils.randomString(64)
        });
        
        if (!device.name) {
            return renderDeviceScreen(req, res, 'Register new device', device,
                'Your device name must not be empty.');
        }
        
        device.save()
            .then((d) => {
                return res.redirect(RouteUtils.getRoute(`/devices/${d.id}?success=3`));
            })
            .catch((err) => {
                debug("Failed to save Device %s", device.id);
                console.error(err);
                return renderDeviceScreen(req, res, 'Register new device', device,
                    'An error occurred while creating the device. Please try again later.');
            });
    });

router.post('/:deviceId',
    ensureLoggedIn(),
    (req, res, next) => {
        Device.findOne({
            where: {
                owner_id: req.user.id,
                id: req.params.deviceId
            }
        }).then((device) => {
            if (device) {
                device.name = req.body['device.name'] || null;

                if (!device.name) {
                    return renderDeviceScreen(req, res, `Edit device: ${device.name}`, device,
                        'Your device name must not be empty.');
                }

                device.save()
                    .then(() => {
                        return res.redirect(RouteUtils.getRoute(`/devices/${device.id}?success=1`));
                    })
                    .catch((err) => {
                        debug("Failed to save Device %s", device.id);
                        console.error(err);
                        return renderDeviceScreen(req, res, `Edit device: ${device.name}`, device,
                            'An error occurred while saving your changes. Please try again later.');
                });
            } else {
                next(); // 404
            }
        });
    });

router.get('/:deviceId/delete',
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
                return HandleRender.render(res, 'devices/delete', `Delete device "${device.name}"`, {
                    device: device
                });
            } else {
                next(); // 404
            }
        });
    });

router.post('/:deviceId/delete',
    ensureLoggedIn(),
    (req, res, next) => {
        Device.findOne({
            where: {
                owner_id: req.user.id,
                id: req.params.deviceId
            }
        }).then((device) => {
            if (device) {
                // TODO: Delete all associated data with the device
                device.destroy()
                    .then(() => {
                        res.redirect(RouteUtils.getRoute('/devices'));
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
