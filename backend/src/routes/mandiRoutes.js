const express = require('express');
const router = express.Router();
const { getMandiPrices } = require('../controllers/mandiController');

router.get('/prices', getMandiPrices);

module.exports = router;