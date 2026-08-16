const db = require('../config/db');

function findRecommendation(region, season, soilType, callback) {
  const sql = `SELECT * FROM crop_lookup WHERE region = ? AND season = ? AND soil_type = ?`;
  db.get(sql, [region, season, soilType], (err, row) => {
    callback(err, row);
  });
}

module.exports = { findRecommendation };