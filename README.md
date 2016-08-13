# zoro-log

Lightweight file logging using [log](https://github.com/tj/log.js)

log is an instance of [log](https://github.com/tj/log.js)

Without configuration, it will write logs to folder './logs', each file per day.

```
// 1. require
var log = require('zoro-log')
// 2. config dir and filenameFormat for writing logs
log.config('logs', 'yyyy-MM-dd hh:mm:ss:SSS')
log.info('foo')
```
