const debug = require('debug')('PinMyPi:Routes:user');
const config = require('config');
const HandleRender = require('../utils/handlebar-renderer');
const auth = require('../auth');
const AuthUtils = require('../auth/utils');
const RouteUtils = require('../utils/route-utils');
const ensureLoggedIn = require('../auth/utils').ensureLoggedIn;
const Utils = require('../utils');

const router = require('express').Router();

const renderChangePasswordScreen = (req, res, error, success) => {
    if (error) {
        res.status(400);
    }
    return HandleRender.render(
        res, 
        'user/main', 
        'User Settings: Password',
        {
            error: error || null,
            success: success || null
        }
    );
};

router.get('/',
    ensureLoggedIn(),
    (req, res, next) => {
        return renderChangePasswordScreen(req, res, null,
            req.query['success'] ? 'Your password has been changed successfully.' : null);
    });

router.get('/keys',
    ensureLoggedIn(),
    (req, res, next) => {
        return HandleRender.render(res, 'user/keys', 'User Settings: API Keys');
    });

router.post('/',
    ensureLoggedIn(),
    (req, res, next) => {
        if (req.body.newPassword !== req.body.confirmPassword) {
            return renderChangePasswordScreen(req, res, 
                'Your new passwords don\'t match. Please check your entry and try again.');
        }
        AuthUtils.findUserByUsernameAndPassword(req.user.username, req.body.oldPassword)
            .then((user) => {
                if (user) {
                    user.passhash = AuthUtils.encodePassword(req.body.newPassword);
                    user.save()
                        .then((u) => {
                            res.redirect(RouteUtils.getRoute('/me?success=1'));
                        })
                        .catch(() => {
                            return renderChangePasswordScreen(req, res,
                                'An error occured while saving your password. Please try again later.');
                        });
                } else {
                    return renderChangePasswordScreen(req, res, 
                        'Your old password is incorrect. Please check your entry and try again.');
                }
            });
    });

module.exports = {
    baseUri: "/me",
    handler: router
};
