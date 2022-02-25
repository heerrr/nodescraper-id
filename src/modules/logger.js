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


        const logger = createLogger({
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
            logger.add(new transports.Console({
                format: format.simple(),
            }));

        }
        this.logger = logger;


    }

    info(message) {
        this.logger.info(message);
    }
    error(message) {
        this.logger.error(message);
    }
    emerg(message) {
        this.logger.emerg(message);
    }
    debug(message) {
        this.logger.debug(message);
    }
    warn(message) {
        this.logger.warn(message);
    }
    alert(message) {
        this.logger.alert(message);
    }
    crit(message) {
        this.logger.crit(message);
    }
    notice(message) {
        this.logger.notice(message);
    }

}


const logger = new Logger();
module.exports = logger;