const api = require('../modules/api');
const tokopediaScraper = require('../scraper/tokopedia.scraper');

const products = async function(req, res) {
    res.json(await api.run(async ()=>{
        const vendor = req.query.vendor;
        const q = req.query.q;


        try {
            const products = await tokopediaScraper.scrape({vendor, q});
            return products;
        } catch (e) {
            return e;
        }



    }));
};


module.exports = {
    products,
};