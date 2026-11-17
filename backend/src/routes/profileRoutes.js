const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getProfile, editProfile, changePassword } = require('../controllers/profileController');

router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, editProfile);
router.put('/password', verifyToken, changePassword);

module.exports = router;