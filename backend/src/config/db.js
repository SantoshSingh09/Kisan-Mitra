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
      if (err) console.error('Schema error:', err.message);
      else console.log('Tables ready');
    });
  }
});

module.exports = db;