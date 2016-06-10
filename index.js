const util = require('util')
const winston = require('winston')
const logger = new winston.Logger()
const production = (process.env.NODE_ENV || '').toLowerCase() === 'production'

module.exports = {
    middleware: function (req, res, next) {
        console.info(req.method, req.url, res.statusCode)
        next()
    },
    production: production
}

// Override the built-in console methods with winston hooks
switch((process.env.NODE_ENV || '').toLowerCase()) {
    case 'production':
        production = true;
        logger.add(winston.transports.File, {
            filename: process.env.LOGFILE || __dirname + '/application.log',
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
            level: 'warn'
        });
        break
    case 'test':
        // Don't set up the logger overrides
        return
    default:
        logger.add(winston.transports.Console, {
            colorize: true,
            timestamp: true,
            exitOnError: false,
            level: 'debug'
        })
        break
}

function formatArgs (args) {
    return [ util.format.apply(util.format, Array.prototype.slice.call(args)) ]
}

console.log = function () {
    logger.info.apply(logger, formatArgs(arguments))
}
console.info = function () {
    logger.info.apply(logger, formatArgs(arguments))
}
console.warn = function () {
    logger.warn.apply(logger, formatArgs(arguments))
}
console.error = function () {
    logger.error.apply(logger, formatArgs(arguments))
}
console.debug = function () {
    logger.debug.apply(logger, formatArgs(arguments))
}