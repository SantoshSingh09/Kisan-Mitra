const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  addCrop,
  listCrops,
  addExpenseEntry,
  addSaleEntry,
  getCropSummary
} = require('../controllers/financeController');

router.post('/crop', verifyToken, addCrop);
router.get('/crops', verifyToken, listCrops);
router.post('/expense', verifyToken, addExpenseEntry);
router.post('/sale', verifyToken, addSaleEntry);
router.get('/summary/:cropId', verifyToken, getCropSummary);

module.exports = router;