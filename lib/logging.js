const { createLogger, format, transports: { Console } } = require('winston')
const morgan = require('morgan')

// https://github.com/winstonjs/winston#logging
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const level = process.env.LOG_LEVEL || 'debug'

function formatParams (info) {
  const { timestamp, level, message, ...args } = info
  const ts = timestamp.slice(0, 19).replace('T', ' ')

  return `${ts} ${level}: ${message} ${Object.keys(args).length
    ? JSON.stringify(args, '', '')
    : ''}`
}

// https://github.com/winstonjs/winston/issues/1135
const developmentFormat = format
  .combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(formatParams)
  )

const productionFormat = format
  .combine(
    format.timestamp(),
    format.align(),
    format.printf(formatParams)
  )

let logger

if (/^test/.test(process.env.NODE_ENV)) {
  logger = createLogger({
    level,
    transports: [new Console({ silent: true })]
  })
} else if (process.env.NODE_ENV !== 'production') {
  logger = createLogger({
    level,
    format: developmentFormat,
    transports: [new Console()]
  })
} else {
  logger = createLogger({
    level,
    format: productionFormat,
    transports: [
      new Console()
      /* new File({ filename: "error.log", level: "error" }),
      new File({ filename: "combined.log" }) */
    ]
  })
}

const requestLogger = morgan('combined', {
  stream: {
    write: (message) => {
      if (message.indexOf('status:5') >= 0) {
        logger.error(message.trim())
      } else {
        logger.info(message.trim())
      }
    }
  }
})

module.exports = {
  logger,
  requestLogger
}
