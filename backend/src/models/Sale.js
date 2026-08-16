const db = require('../config/db');

function addSale(cropId, quantity, rate, mandiName, callback) {
  const sql = `INSERT INTO sales (crop_id, quantity, rate, mandi_name) VALUES (?, ?, ?, ?)`;
  db.run(sql, [cropId, quantity, rate, mandiName], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

function getSalesByCrop(cropId, callback) {
  const sql = `SELECT * FROM sales WHERE crop_id = ? ORDER BY date DESC`;
  db.all(sql, [cropId], (err, rows) => {
    callback(err, rows);
  });
}

module.exports = { addSale, getSalesByCrop };