const debug = require('debug')('zoro-log')
const Log = require('log')
const path = require('path')
const fs = require('fs-extra')
const util = require('zoro-base')

const log = exports = module.exports = new Log()
const defaultDir = 'logs'
let dir = defaultDir
const defaultFormat = 'yyyy-MM-dd'
let format = defaultFormat

const refreshStream = (() => {
  let prevName
  return function () {
    let name = util.format(new Date(), format) + '.log'
    if (name !== prevName) {
      // stop previous stream, and open new stream
      if (prevName) {
        log.stream.end()
      }
      prevName = name
      // use resolve, so it's ok if dir is absolute
      const filepath = path.resolve(process.cwd(), dir, name)
      fs.ensureFileSync(filepath)
      log.stream = fs.createWriteStream(filepath, {
        flags: 'a'
      })
      log.stream.on('error', err => {
        log.emit('error', err)
      })
      debug('refresh stream %s', filepath)
    }
  }
})()

// config dir and filename for storing logs
exports.config = function (baseDir = defaultDir, filenameFormat = defaultFormat) {
  dir = baseDir
  format = filenameFormat
  refreshStream()
}

// rewrite .log to switch file
log.log = (() => {
  const superLog = Log.prototype.log
  return function () {
    refreshStream()
    superLog.apply(log, arguments)
  }
})()
