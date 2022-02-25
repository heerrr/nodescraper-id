const express = require('express');
const apiRunner = require('../modules/api');
const tokopediaRoute = require('./tokopedia.route');


const router = express.Router();
router.use('/tokopedia', tokopediaRoute);
router.get('/', (req, res) => res.send('Node Scrapper ID API Version 1.0.0'));
router.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
});
router.get('/health', async (req, res) => {
    res.json(await apiRunner(async ()=>{
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        };
        return healthcheck;
    }));
});
module.exports = router;