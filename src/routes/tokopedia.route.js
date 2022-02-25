const express = require('express');
const router = express.Router({ mergeParams: true });
const tokopediaController = require('../controllers/tokopedia.controller');
router.route('/products')
    .get(tokopediaController.products);

module.exports = router;