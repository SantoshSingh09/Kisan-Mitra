const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/authMiddleware');
const {
  getStats, listUsers, deleteUser, listCropLookup, addCropLookup, deleteCropLookup
} = require('../controllers/adminController');

router.get('/stats', verifyToken, requireAdmin, getStats);
router.get('/users', verifyToken, requireAdmin, listUsers);
router.delete('/users/:id', verifyToken, requireAdmin, deleteUser);
router.get('/crop-lookup', verifyToken, requireAdmin, listCropLookup);
router.post('/crop-lookup', verifyToken, requireAdmin, addCropLookup);
router.delete('/crop-lookup/:id', verifyToken, requireAdmin, deleteCropLookup);

module.exports = router;