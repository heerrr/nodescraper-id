const errorFormatter = function(error) {
    if(error instanceof Error) {
        return error.message + ' with stacks:' + error.stack;
    }
    if(typeof error == 'object') {
        return JSON.stringify(error);
    }
    return error;
};

module.exports = errorFormatter;
