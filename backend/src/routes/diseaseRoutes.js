const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { detectDisease } = require('../controllers/diseaseController');

router.post('/detect', verifyToken, express.json({ limit: '8mb' }), detectDisease);

module.exports = router;