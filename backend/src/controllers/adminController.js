const db = require('../config/db');

function getStats(req, res) {
  const stats = {};
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    stats.totalUsers = row ? row.count : 0;
    db.get('SELECT COUNT(*) as count FROM crops', [], (err, row) => {
      stats.totalCrops = row ? row.count : 0;
      db.get('SELECT COUNT(*) as count FROM expenses', [], (err, row) => {
        stats.totalExpenses = row ? row.count : 0;
        db.get('SELECT COUNT(*) as count FROM sales', [], (err, row) => {
          stats.totalSales = row ? row.count : 0;
          res.json(stats);
        });
      });
    });
  });
}

function listUsers(req, res) {
  db.all('SELECT id, name, phone, region, role, created_at FROM users ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json({ users: rows });
  });
}

function deleteUser(req, res) {
  const userId = req.params.id;

  // Cascade delete: remove this user's expenses/sales, then their crops, then the user.
  db.all('SELECT id FROM crops WHERE user_id = ?', [userId], (err, crops) => {
    if (err) return res.status(500).json({ message: 'Error looking up user data' });
    const cropIds = crops.map(c => c.id);

    const deleteExpensesSales = () => {
      if (cropIds.length === 0) return deleteCropsAndUser();
      const placeholders = cropIds.map(() => '?').join(',');
      db.run(`DELETE FROM expenses WHERE crop_id IN (${placeholders})`, cropIds, () => {
        db.run(`DELETE FROM sales WHERE crop_id IN (${placeholders})`, cropIds, deleteCropsAndUser);
      });
    };

    const deleteCropsAndUser = () => {
      db.run('DELETE FROM crops WHERE user_id = ?', [userId], () => {
        db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
          if (err) return res.status(500).json({ message: 'Error deleting user' });
          if (this.changes === 0) return res.status(404).json({ message: 'User not found' });
          res.json({ message: 'User and all their data deleted successfully' });
        });
      });
    };

    deleteExpensesSales();
  });
}

function listCropLookup(req, res) {
  db.all('SELECT * FROM crop_lookup ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching crop data' });
    res.json({ entries: rows });
  });
}

function addCropLookup(req, res) {
  const { region, season, soilType, recommendedCrops } = req.body;
  if (!region || !season || !soilType || !recommendedCrops) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const sql = `INSERT INTO crop_lookup (region, season, soil_type, recommended_crops) VALUES (?, ?, ?, ?)`;
  db.run(sql, [region, season, soilType, recommendedCrops], function (err) {
    if (err) return res.status(500).json({ message: 'Error adding entry' });
    res.status(201).json({ message: 'Entry added successfully', id: this.lastID });
  });
}

function deleteCropLookup(req, res) {
  db.run('DELETE FROM crop_lookup WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'Error deleting entry' });
    if (this.changes === 0) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted successfully' });
  });
}

module.exports = { getStats, listUsers, deleteUser, listCropLookup, addCropLookup, deleteCropLookup };