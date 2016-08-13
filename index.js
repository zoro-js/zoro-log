const debug = require('debug')('log')
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
      debug('refresh stream %s -> %s', prevName, name)
      // stop previous stream, and open new stream
      if (prevName) {
        log.stream.end()
      }
      prevName = name
      const filepath = path.join(process.cwd(), dir, name)
      fs.ensureFileSync(filepath)
      log.stream = fs.createWriteStream(filepath, {
        flags: 'a'
      })
    }
  }
})()

// config dir for storing logs
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
