const { createCrop, getCropsByUser, getCropById } = require('../models/Crop');
const { addExpense, getExpensesByCrop } = require('../models/Expense');
const { addSale, getSalesByCrop } = require('../models/Sale');

// ---- CROPS ----
function addCrop(req, res) {
  const { cropName, sowingDate, area, season } = req.body;
  if (!cropName) return res.status(400).json({ message: 'Crop name is required' });

  createCrop(req.userId, cropName, sowingDate, area, season, (err, cropId) => {
    if (err) return res.status(500).json({ message: 'Error adding crop' });
    res.status(201).json({ message: 'Crop added successfully', cropId });
  });
}

function listCrops(req, res) {
  getCropsByUser(req.userId, (err, crops) => {
    if (err) return res.status(500).json({ message: 'Error fetching crops' });
    res.json({ crops });
  });
}

// ---- EXPENSES ----
function addExpenseEntry(req, res) {
  const { cropId, type, amount } = req.body;
  if (!cropId || !type || !amount) {
    return res.status(400).json({ message: 'cropId, type and amount are required' });
  }
  addExpense(cropId, type, amount, (err, expenseId) => {
    if (err) return res.status(500).json({ message: 'Error adding expense' });
    res.status(201).json({ message: 'Expense added successfully', expenseId });
  });
}

// ---- SALES ----
function addSaleEntry(req, res) {
  const { cropId, quantity, rate, mandiName } = req.body;
  if (!cropId || !quantity || !rate) {
    return res.status(400).json({ message: 'cropId, quantity and rate are required' });
  }
  addSale(cropId, quantity, rate, mandiName, (err, saleId) => {
    if (err) return res.status(500).json({ message: 'Error adding sale' });
    res.status(201).json({ message: 'Sale added successfully', saleId });
  });
}

// ---- SUMMARY (profit/loss for one crop) ----
function getCropSummary(req, res) {
  const cropId = req.params.cropId;

  getCropById(cropId, (err, crop) => {
    if (err || !crop) return res.status(404).json({ message: 'Crop not found' });

    getExpensesByCrop(cropId, (err, expenses) => {
      if (err) return res.status(500).json({ message: 'Error fetching expenses' });

      getSalesByCrop(cropId, (err, sales) => {
        if (err) return res.status(500).json({ message: 'Error fetching sales' });

        const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalIncome = sales.reduce((sum, s) => sum + (s.quantity * s.rate), 0);
        const profit = totalIncome - totalExpense;

        res.json({
          crop,
          totalExpense,
          totalIncome,
          profit,
          expenses,
          sales
        });
      });
    });
  });
}

module.exports = { addCrop, listCrops, addExpenseEntry, addSaleEntry, getCropSummary };