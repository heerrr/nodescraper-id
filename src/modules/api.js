const logger = require('./logger');
const errorFormatter = require('../formatter/error.formatter');
const responseFormatter = require('../formatter/response.formatter');


class Api {
    async run(callback)  {
        const runner =  new Promise((resolve) => {

            if(callback instanceof Promise) {
                callback.then((data) => {
                    resolve(data);
                }).catch((err)=> {
                    resolve(err);
                });
            } else {
                resolve(callback());
            }
        });
        let data;
        try {
            data = await runner;

        } catch(e) {
            data =e;
        }
        if(data instanceof Error) {
            logger.error(errorFormatter(data));
            return responseFormatter({},1,errorFormatter(data));
        }
        return responseFormatter(data);
    }
}

const api = new Api();
module.exports = api;