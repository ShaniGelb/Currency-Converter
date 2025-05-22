const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../db.sqlite');
const db = new sqlite3.Database(dbPath);

// Create currencies table if not exists
const createCurrenciesTable = `
CREATE TABLE IF NOT EXISTS currencies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
`;

// Create exchange_rates table if not exists
const createExchangeRatesTable = `
CREATE TABLE IF NOT EXISTS exchange_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_currency TEXT NOT NULL,
  to_currency TEXT NOT NULL,
  rate REAL NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (from_currency) REFERENCES currencies(code),
  FOREIGN KEY (to_currency) REFERENCES currencies(code)
);
`;

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'ILS', name: 'Israeli Shekel' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'RUB', name: 'Russian Ruble' }
];

function insertSampleRates() {
  db.run('DELETE FROM exchange_rates', (err) => {
    if (err) throw err;
    const today = '2025-05-22 10:00:00';
    const sampleRates = [];
    currencies.forEach(from => {
      currencies.forEach(to => {
        if (from.code !== to.code) {
          let rate = (Math.random() * 5 + 0.5).toFixed(4);
          if (from.code === 'USD' && to.code === 'ILS') rate = 3.65;
          if (from.code === 'ILS' && to.code === 'USD') rate = 0.27;
          if (from.code === 'USD' && to.code === 'EUR') rate = 0.92;
          if (from.code === 'EUR' && to.code === 'USD') rate = 1.09;
          if (from.code === 'USD' && to.code === 'GBP') rate = 0.79;
          if (from.code === 'GBP' && to.code === 'USD') rate = 1.27;
          if (from.code === 'USD' && to.code === 'JPY') rate = 151.62;
          if (from.code === 'USD' && to.code === 'AUD') rate = 1.52;
          if (from.code === 'USD' && to.code === 'CAD') rate = 1.35;
          if (from.code === 'USD' && to.code === 'CHF') rate = 0.90;
          if (from.code === 'USD' && to.code === 'CNY') rate = 7.23;
          if (from.code === 'USD' && to.code === 'RUB') rate = 92.45;
          sampleRates.push({ from: from.code, to: to.code, rate: parseFloat(rate), created_at: today });
        }
      });
    });
    const stmt = db.prepare('INSERT INTO exchange_rates (from_currency, to_currency, rate, created_at) VALUES (?, ?, ?, ?)');
    sampleRates.forEach(r => stmt.run(r.from, r.to, r.rate, r.created_at));
    stmt.finalize(() => {
      console.log('Inserted sample exchange rates.');
      db.close();
    });
  });
}

function insertCurrenciesIfEmpty() {
  db.get('SELECT COUNT(*) as count FROM currencies', (err, row) => {
    if (err) throw err;
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO currencies (code, name) VALUES (?, ?)');
      currencies.forEach(c => stmt.run(c.code, c.name));
      stmt.finalize(() => {
        console.log('Inserted default currencies.');
        insertSampleRates();
      });
    } else {
      console.log('Currencies table already has data.');
      insertSampleRates();
    }
  });
}

db.serialize(() => {
  db.run(createCurrenciesTable, err => {
    if (err) throw err;
    db.run(createExchangeRatesTable, err2 => {
      if (err2) throw err2;
      insertCurrenciesIfEmpty();
    });
  });
}); 