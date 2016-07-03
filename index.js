const LOGFILE = process.env.LOGFILE || './application.log'

const util = require('util')
const winston = require('winston')
const logger = new winston.Logger()
let production = (process.env.NODE_ENV || '').toLowerCase() === 'production'

require('winston-papertrail').Papertrail

module.exports = {
  middleware: function (req, res, next) {
    console.info(req.method, req.url, res.statusCode)
    next()
  },
  production: production
}

// Override the built-in console methods with winston hooks
switch ((process.env.NODE_ENV || '').toLowerCase()) {
  case 'production':
    production = true
    logger.add(winston.transports.Papertrail, {
      host: 'logs.papertailapp.com',
      port: 12345
    })
    break
  case 'development':
    production = false
    logger.add(winston.transports.File, {
      filename: LOGFILE,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      level: 'warn'
    })
    break
  case 'test':
    // Don't set up the logger overrides
    break
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
