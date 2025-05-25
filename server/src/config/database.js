// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// // Path to the SQLite database file
// const dbPath = path.resolve(__dirname, '../../../db.sqlite');

// const db = new sqlite3.Database(dbPath, (err) => {
//   if (err) {
//     console.error('Could not connect to SQLite database:', err.message);
//   } else {
//     console.log('Connected to SQLite database.');
//   }
// });
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Full path to the DB file
const dbPath = path.resolve(__dirname, '../../../db.sqlite');

// Delete DB if exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🔁 Existing database deleted.');
} else {
  console.log('📂 No existing database found.');
}

console.log('🚀 Reinitializing database...');
require('../../initSqliteDb.js'); // יוצרת את מבנה הטבלאות ומזינה ערכים

// Connect again (new instance after recreation)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

module.exports = db;

