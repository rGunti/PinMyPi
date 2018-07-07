const debug = require('debug')('PinMyPi:ErrorHandling');
const config = require('config');
const moment = require('moment');
const HandleRender = require('../utils/handlebar-renderer');

module.exports = (app) => {
    app.use((req, res, next) => {
        res.status(404);
        HandleRender.render(res, 'err/404', 'Page Not Found', {
            requestedUrl: req.url
        });
    });

    app.use((err, req, res, next) => {
        let errorInfo = {
            message: err.message,
            status: null,
            trace: null,
            error: null,
            requestedUrl: `${req.method} ${req.url}`,
            timestamp: moment().toISOString()
        };

        if (config.get('server.showTraces')) {
            errorInfo.status = err.status;
            errorInfo.trace = err.stack;
            errorInfo.error = err;
        }

        res.status(err.status || 500);
        debug(err);
        HandleRender.render(res, `err/${err.status || 500}`, 'Error', errorInfo);
    });
};
