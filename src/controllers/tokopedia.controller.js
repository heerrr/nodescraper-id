const api = require('../modules/api');
const apiRunner = require('../modules/api');

const products = async function(req, res) {
    res.json(await api.run(async ()=>{
        return {};
    }));
};


module.exports = {
    products,
};