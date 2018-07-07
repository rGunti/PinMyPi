const Base64 = require('js-base64').Base64;
const sha256 = require('sha256');
const RouteUtils = require('../utils/route-utils');
const ensure = require('connect-ensure-login');

const db = require('../db/models');
const MUser = db.User;

const AuthUtils = {
    encodePassword: (password) => {
        return AuthUtils._reverseString(
            sha256(Base64.encode(password))
        );
    },
    _reverseString: (s) => {
        return s.split("").reverse().join("");
    },
    ensureLoggedIn: () => {
        return ensure.ensureLoggedIn(RouteUtils.getRoute("/auth/login"))
    },
    findUserByUsernameAndPassword: (username, password) => {
        return MUser.findOne({
            where: {
                username: username,
                passhash: AuthUtils.encodePassword(password)
            }
        });
    }
};

module.exports = AuthUtils;