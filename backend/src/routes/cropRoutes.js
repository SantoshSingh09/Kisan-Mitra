const express = require('express');
const router = express.Router();
const { recommendCrops, getCropDetails } = require('../controllers/cropController');

router.get('/recommend', recommendCrops);
router.get('/details', getCropDetails);

module.exports = router;