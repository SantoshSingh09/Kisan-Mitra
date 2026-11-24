const db = require('../config/db');

function getUserById(userId, callback) {
  const sql = `SELECT id, name, phone, region, block, role, created_at FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, row) => {
    callback(err, row);
  });
}

function updateProfile(userId, name, region, block, callback) {
  const sql = `UPDATE users SET name = ?, region = ?, block = ? WHERE id = ?`;
  db.run(sql, [name, region, block, userId], function (err) {
    callback(err, this ? this.changes : 0);
  });
}

function updatePassword(userId, hashedPassword, callback) {
  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  db.run(sql, [hashedPassword, userId], function (err) {
    callback(err, this ? this.changes : 0);
  });
}

function getPasswordHash(userId, callback) {
  const sql = `SELECT password FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, row) => {
    callback(err, row ? row.password : null);
  });
}

module.exports = { getUserById, updateProfile, updatePassword, getPasswordHash };