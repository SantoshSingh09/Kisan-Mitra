// Run this once to make an existing user an admin:
// node scripts/promote-admin.js 9876543210
require('dotenv').config();
const db = require('../src/config/db');

const phone = process.argv[2];
if (!phone) {
  console.log('Usage: node scripts/promote-admin.js <phone-number>');
  process.exit(1);
}

setTimeout(() => {
  db.run('UPDATE users SET role = ? WHERE phone = ?', ['admin', phone], function (err) {
    if (err) { console.error('Error:', err.message); process.exit(1); }
    if (this.changes === 0) { console.log('No user found with that phone number'); }
    else { console.log(`User with phone ${phone} is now an admin.`); }
    process.exit(0);
  });
}, 500); // small delay to let the db connection + schema setup finish