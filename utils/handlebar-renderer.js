const debug = require('debug')('PinMyPi:HandlebarRenderer');
const config = require('config');
const HandlebarHelpers = require('./handlebar-helpers');

const HandlebarRenderer = {
    render: (res, view, title, data, callback) => {
        res.render(view, {
            title: title,
            utils: HandlebarHelpers,
            data: data,
            request: res.req,
            ROOT_DIR: config.has('server.rootDir') ? config.get('server.rootDir') : "/"
        }, callback);
    }
};
module.exports = HandlebarRenderer;
