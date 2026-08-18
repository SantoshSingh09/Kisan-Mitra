const db = require('../config/db');

function createCrop(userId, cropName, sowingDate, area, season, callback) {
  const sql = `INSERT INTO crops (user_id, crop_name, sowing_date, area, season) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [userId, cropName, sowingDate, area, season], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

function getCropsByUser(userId, callback) {
  const sql = `SELECT * FROM crops WHERE user_id = ? ORDER BY id DESC`;
  db.all(sql, [userId], (err, rows) => {
    callback(err, rows);
  });
}

function getCropById(cropId, callback) {
  const sql = `SELECT * FROM crops WHERE id = ?`;
  db.get(sql, [cropId], (err, row) => {
    callback(err, row);
  });
}
function deleteCrop(cropId, userId, callback) {
  const sql = `DELETE FROM crops WHERE id = ? AND user_id = ?`;
  db.run(sql, [cropId, userId], function (err) {
    callback(err, this ? this.changes : 0);
  });
}
module.exports = { createCrop, getCropsByUser, getCropById, deleteCrop };