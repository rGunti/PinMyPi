const debug = require('debug')('PinMyPi:HandlebarRenderer');
const config = require('config');
const HandlebarHelpers = require('./handlebar-helpers');

const HandlebarRenderer = {
    render: (res, view, title, data, layout, callback) => {
        res.render(view, {
            title: title,
            layout: layout || 'default',
            utils: HandlebarHelpers,
            data: data,
            request: res.req,
            user: res.req.user,
            ROOT_DIR: config.has('server.rootDir') ? config.get('server.rootDir') : "/"
        }, callback);
    }
};
module.exports = HandlebarRenderer;
