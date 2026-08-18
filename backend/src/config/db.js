const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DB_PATH || './database/kisanmitra.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connect error:', err.message);
  } else {
    console.log('Database connected:', dbPath);
    const schema = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf-8');
    db.exec(schema, (err) => {
      if (err) {
        console.error('Schema error:', err.message);
      } else {
        console.log('Tables ready');
        seedCropLookup();
      }
    });
  }
});

function seedCropLookup() {
  db.get('SELECT COUNT(*) as count FROM crop_lookup', [], (err, row) => {
    if (err) return console.error('Seed check error:', err.message);
    if (row.count > 0) return; // already seeded, skip

    const seedData = [
      ['Gorakhpur', 'kharif', 'alluvial', 'Dhan,Ganna,Makka,Arhar,Urad,Til'],
      ['Gorakhpur', 'kharif', 'clayey', 'Dhan,Jute,Arhar,Urad'],
      ['Gorakhpur', 'kharif', 'sandy', 'Bajra,Moong,Til'],
      ['Gorakhpur', 'rabi', 'alluvial', 'Gehu,Sarso,Chana,Matar,Masoor,Aloo,Alsi'],
      ['Gorakhpur', 'rabi', 'clayey', 'Gehu,Masoor,Chana'],
      ['Gorakhpur', 'rabi', 'sandy', 'Chana,Jau,Sarso'],
      ['Gorakhpur', 'zaid', 'alluvial', 'Kheera,Tarbuz,Moong,Kakdi,Bhindi'],
      ['Gorakhpur', 'zaid', 'clayey', 'Moong,Kheera'],
      ['Gorakhpur', 'zaid', 'sandy', 'Tarbuz,Kheera,Moong']
    ];

    const stmt = db.prepare('INSERT INTO crop_lookup (region, season, soil_type, recommended_crops) VALUES (?, ?, ?, ?)');
    seedData.forEach((row) => stmt.run(row));
    stmt.finalize(() => console.log('Crop lookup data seeded'));
  });
}

module.exports = db;