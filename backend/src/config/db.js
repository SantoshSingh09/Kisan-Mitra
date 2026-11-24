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
        addBlockColumnIfMissing();
        seedCropLookup();
      }
    });
  }
});
function addBlockColumnIfMissing() {
  db.all('PRAGMA table_info(users)', [], (err, cols) => {
    if (err) return console.error('Column check error:', err.message);
    if (cols.some((c) => c.name === 'block')) return;
    db.run('ALTER TABLE users ADD COLUMN block TEXT', (err) => {
      if (err) console.error('Add block column error:', err.message);
      else console.log('users.block column added');
    });
  });
}
function seedCropLookup() {
  db.get('SELECT COUNT(*) as count FROM crop_lookup', [], (err, row) => {
    if (err) return console.error('Seed check error:', err.message);
    if (row.count > 0) return; // already seeded, skip

    const seedData = [
      ['Gorakhpur', 'kharif', 'alluvial', 'Dhan,Ganna,Makka,Arhar,Urad,Soybean,Til,Bhindi,Baingan,Lauki,Tori,Karela'],
      ['Gorakhpur', 'kharif', 'clayey', 'Dhan,Jute,Arhar,Bhindi,Karela'],
      ['Gorakhpur', 'kharif', 'sandy', 'Bajra,Moong,Til,Lauki,Tori'],
      ['Gorakhpur', 'rabi', 'alluvial', 'Gehu,Sarso,Chana,Matar,Jau,Masoor,Alsi,Palak,Methi,Dhaniya,Gobi (Phool),Patta Gobi,Gajar,Mooli'],
      ['Gorakhpur', 'rabi', 'clayey', 'Gehu,Masoor,Alsi,Palak,Mooli'],
      ['Gorakhpur', 'rabi', 'sandy', 'Chana,Jau,Sarso,Gajar,Mooli'],
      ['Gorakhpur', 'zaid', 'alluvial', 'Kheera,Tarbuz,Moong,Bhindi,Kaddu,Kharbuja,Lauki,Tori,Karela'],
      ['Gorakhpur', 'zaid', 'clayey', 'Moong,Bhindi,Lauki'],
      ['Gorakhpur', 'zaid', 'sandy', 'Tarbuz,Kheera,Kharbuja,Kaddu']
    ];

    const stmt = db.prepare('INSERT INTO crop_lookup (region, season, soil_type, recommended_crops) VALUES (?, ?, ?, ?)');
    seedData.forEach((row) => stmt.run(row));
    stmt.finalize(() => console.log('Crop lookup data seeded'));
  });
}

module.exports = db;