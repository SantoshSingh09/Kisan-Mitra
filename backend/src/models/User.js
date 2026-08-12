const db = require('../config/db');

function createUser(name, phone, hashedPassword, region, callback) {
  const sql = `INSERT INTO users (name, phone, password, region) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, phone, hashedPassword, region], function (err) {
    callback(err, this ? this.lastID : null);
  });
}

function findUserByPhone(phone, callback) {
  const sql = `SELECT * FROM users WHERE phone = ?`;
  db.get(sql, [phone], (err, row) => {
    callback(err, row);
  });
}

module.exports = { createUser, findUserByPhone };