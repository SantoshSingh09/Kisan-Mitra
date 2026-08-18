const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  addCrop,
  listCrops,
  addExpenseEntry,
  addSaleEntry,
  getCropSummary,
  deleteExpenseEntry,
  deleteSaleEntry,
  deleteCropEntry
} = require('../controllers/financeController');

router.post('/crop', verifyToken, addCrop);
router.get('/crops', verifyToken, listCrops);
router.post('/expense', verifyToken, addExpenseEntry);
router.post('/sale', verifyToken, addSaleEntry);
router.get('/summary/:cropId', verifyToken, getCropSummary);
router.delete('/expense/:id', verifyToken, deleteExpenseEntry);
router.delete('/sale/:id', verifyToken, deleteSaleEntry);
router.delete('/crop/:id', verifyToken, deleteCropEntry);

module.exports = router;