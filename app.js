#!/usr/bin/env node
const debug = require('debug')('PinMyPi:App');
const config = require('config');

debug('Starting up PinMyPi web service...');

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const hbs = require('express-hbs');
const fs = require('fs');

const app = express();

// View Engine
debug('Configuring view engine...');
const hbsEngine = hbs.express4({
    defaultLayout: path.join(__dirname, 'views', 'layouts', 'default.hbs'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    layoutsDir: path.join(__dirname, 'views', 'layouts')
});
require('handlebars-helpers')({ handlebars: hbs.handlebars });
require('./utils/handlebar-helpers').registerHelperMethods(hbs.handlebars);

app.engine('hbs', hbsEngine);
app.set('view engine', 'hbs');

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.enable('trust proxy');

const staticRoutes = [
    ['/public', './node_modules/bootstrap/dist'],
    ['/public/js', './node_modules/jquery/dist'],
    ['/public', './public'],
];
for (let route of staticRoutes) {
    debug('Loading Static Route %s ...', route[0]);
    app.use(route[0], express.static(path.join(__dirname, route[1])));
}

// Include all routes (js files ending with *.route.js)
fs.readdirSync(path.join(__dirname, 'routes')).forEach(f => {
    if (f.endsWith('.route.js')) {
        debug('Loading Route %s ...', f);
        const routeInfo = require('./routes/' + f);
        app.use(routeInfo.baseUri, routeInfo.handler);
    }
});

debug('Configuring Error Handling...');
require('./routes/error-handling')(app);

debug('Ready for Export!');
module.exports = app;
