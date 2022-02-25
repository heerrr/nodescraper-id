const responseFormatter = function(data,errCode=0,errMessage='') {

    let response = {
        errCode,
        errMessage,
        data
    };
    return response;
    //return JSON.stringify(response);
};

module.exports = responseFormatter;
