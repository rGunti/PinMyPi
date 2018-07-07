const debug = require('debug')('PinMyPi:Utils:Route');
const config = require('config');

const RouteUtils = {
    getRoute: (r) => {
        return RouteUtils.getBasePath() + r;
    },
    getBasePath: (defaultLink = "") => {
        return config.has('server.rootDir') ? config.get('server.rootDir') : defaultLink;
    }
};

module.exports = RouteUtils;
