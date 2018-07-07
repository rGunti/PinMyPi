#!/usr/bin/env node
const debug = require('debug')('PinMyPi:App');
const config = require('config');

debug('Starting up PinMyPi web service...');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const hbs = require('express-hbs');
const fs = require('fs');

// Test database connection
const db = require('./db/models');
debug('Connecting to database ...');
db.sequelize.authenticate()
    .then(() => {
        debug('Database connected!');

        // Test a database call
        const sequelize = require('sequelize');
        const MUser = db.User;
        MUser.findAll()
            .then((users) => {
                debug('Found %s registered users', users.length);
            })
            .catch((err) => {
                const msg = "WARNING: Failed to fetch number of registered users. This might cause problems later when data is requested from the database.";
                debug(msg);
                console.error(msg);
            });
    })
    .catch((err) => {
        debug('Database connection failed!');
        console.error(err);
        require('sys').exit(1000);
    });

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
app.use(require('express-session')({ secret: config.get('session.secret'), resave: false, saveUninitialized: false }));
app.enable('trust proxy');

debug('Setting up authentication...');
const auth = require('./auth');
app.use(auth.initialize());
app.use(auth.session());
app.use(auth.authenticate('remember-me'));

const rootDir = config.has('server.rootDir') ? config.get('server.rootDir') : '';
if (rootDir) {
    debug('Routes will be setup with base/root route %s', rootDir);
}

const staticRoutes = [
    ['/public', './node_modules/bootstrap/dist'],
    ['/public/js', './node_modules/jquery/dist'],
    ['/public/js', './node_modules/moment/min/'],
    ['/public/js', './node_modules/moment-duration-format/lib/'],
    ['/public', './public'],
];
for (let route of staticRoutes) {
    debug('Loading Static Route %s ...', route[0]);
    app.use(rootDir + route[0], express.static(path.join(__dirname, route[1])));
}

// Include all routes (js files ending with *.route.js)
fs.readdirSync(path.join(__dirname, 'routes')).forEach(f => {
    if (f.endsWith('.route.js')) {
        debug('Loading Route %s ...', f);
        const routeInfo = require('./routes/' + f);
        app.use(rootDir + routeInfo.baseUri, routeInfo.handler);
    }
});

debug('Configuring Error Handling...');
require('./routes/error-handling')(app);

debug('Ready for Export!');
module.exports = app;
