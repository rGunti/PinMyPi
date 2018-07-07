const debug = require('debug')('PinMyPi:HandlebarHelpers');
const package = require(__dirname + '/../package.json');
const config = require('config');

const HandlebarHelpers = {
    package: package,
    registeredMethods: {
        getObjectValue: (object, options) => {
            return options.fn(object[options.hash.key]);
        },
        fileSizes: [
            { maxExp: 1, shortUnit: 'B',  longUnit: 'bytes'    , decimals: 0 },
            { maxExp: 2, shortUnit: 'kB', longUnit: 'kilobytes', decimals: 2 },
            { maxExp: 3, shortUnit: 'MB', longUnit: 'megabytes', decimals: 2 },
            { maxExp: 4, shortUnit: 'GB', longUnit: 'gigabytes', decimals: 2 },
            { maxExp: 5, shortUnit: 'TB', longUnit: 'terabytes', decimals: 2 }
        ],
        formatFileSize: (o) => {
            let lastUnitDef = {};
            for (let size of HandlebarHelpers.registeredMethods.fileSizes) {
                lastUnitDef = size;
                if (o < Math.pow(1024, size.maxExp)) {
                    let result = HandlebarHelpers.roundNumber(o / Math.pow(1024, size.maxExp - 1), size.decimals);
                    return `${result.toFixed(size.decimals)} ${size.shortUnit}`;
                }
            }
            let result = HandlebarHelpers.roundNumber(o / Math.pow(1024, lastUnitDef.maxExp - 1), lastUnitDef.decimals);
            return `${result.toFixed(lastUnitDef.decimals)} ${lastUnitDef.shortUnit}`;
        },
        currentYear: () => new Date().getFullYear(),
        getConfig: (o) => {
            return config.get(o);
        },
        isLoggedIn: (options) => {
            var fnTrue = options.fn,
                fnFalse = options.inverse,
                data = options.data.root;
            
            return (data.user) ? fnTrue(this) : fnFalse(this);
        },
        userData: (attrib, options) => {
            return options.data.root.user[attrib];
        }
    },
    roundNumber: (num, decimals) => {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
    },
    registerHelperMethods: (hbs) => {
        for (let key in HandlebarHelpers.registeredMethods) {
            debug(` - Registering Helper ${key} ...`);
            hbs.registerHelper(key, HandlebarHelpers.registeredMethods[key]);
        }
    }
};
module.exports = HandlebarHelpers;
