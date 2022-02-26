const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// const LOG_LEVEL = {
//     emerg: 0,
//     alert: 1,
//     crit: 2,
//     error: 3,
//     warning: 4,
//     notice: 5,
//     info: 6,
//     debug: 7
// };
class Logger {
    constructor() {
        var allTransport = new DailyRotateFile({
            filename: 'logs/nodescrapper/nodescrapper-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: process.env.LOG_MAX_SIZE,
            maxFiles: process.env.LOG_MAX_FILES,
            level: process.env.LOG_LEVEL
        });
        var errorTransport = new DailyRotateFile({
            filename: 'logs/error/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: process.env.LOG_MAX_SIZE,
            maxFiles: process.env.LOG_MAX_FILES,
            level: 'error',
        });


        const winston = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.json()),
            defaultMeta: {  },
            transports: [
                //
                // - Write all logs with importance level of `error` or less to `error.log`
                // - Write all logs with importance level of `info` or less to `combined.log`
                //
                errorTransport,
                allTransport,
            ],
        });


        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (process.env.NODE_ENV !== 'production') {
            winston.add(new transports.Console({
                format: format.simple(),
            }));

        }
        this.winston = winston;


    }

    info(message) {
        this.winston.info(message);
    }
    error(message) {
        this.winston.error(message);
    }
    emerg(message) {
        this.winston.emerg(message);
    }
    debug(message) {
        this.winston.debug(message);
    }
    warn(message) {
        this.winston.warn(message);
    }
    alert(message) {
        this.winston.alert(message);
    }
    crit(message) {
        this.winston.crit(message);
    }
    notice(message) {
        this.winston.notice(message);
    }

}


const logger = new Logger();
module.exports = logger;