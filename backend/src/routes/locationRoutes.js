const express = require('express');
const router = express.Router();
const { reverseGeocode } = require('../controllers/locationController');

router.get('/reverse', reverseGeocode);

module.exports = router;