const express = require('express');
const router = express.Router();
const { recommendCrops } = require('../controllers/cropController');

router.get('/recommend', recommendCrops);

module.exports = router;