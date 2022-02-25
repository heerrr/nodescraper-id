global.basedir = require('path').resolve(__dirname, '..');
require('dotenv').config({path: __dirname +'/../.env'});
const express = require('express');
const http = require('http');
const cors = require('cors');
const logger = require('./modules/logger');
const port = process.env.PORT || 8000;
const routes = require('./routes/index.route');
const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE' , 'OPTIONS'],
    origin: ['http://localhost:3005']
}));

app.use(routes);

const httpServer = http.createServer(app);
httpServer.listen(port);
logger.info(`[NodeScrapper] http server listening at port ${port}`);


//process

const terminate = (server, options = { coredump: false, timeout: 500 }) => {
    // Exit function
    const exit = code => {
        options.coredump ? process.abort() : process.exit(code);
    };

    // eslint-disable-next-line no-unused-vars
    return (code, reason) => (err, promise) => {
        if (err && err instanceof Error) {
            // Log error information, use a proper logging library here :)
            waLogger.logger.child({
                error:err.message,
                trace:err.stack,
            }).error(reason);
        }

        // Attempt a graceful shutdown
        server.close(exit);
        setTimeout(exit, options.timeout).unref();
    };
};


const exitHandler = terminate(httpServer, {
    coredump: false,
    timeout: 500
});
process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));

module.exports = { app };