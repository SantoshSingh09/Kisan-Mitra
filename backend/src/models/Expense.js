const db = require('../config/db');

function addExpense(cropId, type, amount, callback) {
  const sql = `INSERT INTO expenses (crop_id, type, amount) VALUES (?, ?, ?)`;
  db.run(sql, [cropId, type, amount], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

function getExpensesByCrop(cropId, callback) {
  const sql = `SELECT * FROM expenses WHERE crop_id = ? ORDER BY date DESC`;
  db.all(sql, [cropId], (err, rows) => {
    callback(err, rows);
  });
}
function deleteExpense(expenseId, callback) {
  const sql = `DELETE FROM expenses WHERE id = ?`;
  db.run(sql, [expenseId], function (err) {
    callback(err, this ? this.changes : 0);
  });
}

module.exports = { addExpense, getExpensesByCrop, deleteExpense };