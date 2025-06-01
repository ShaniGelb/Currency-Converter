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

    const sampleRates = [];
    const now = new Date();

    // לולאה על 30 ימים אחורה
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(now);
      date.setDate(now.getDate() - dayOffset);
      const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

      currencies.forEach(from => {
        currencies.forEach(to => {
          if (from.code !== to.code) {
            // אפשרות לערך רנדומלי עם סטייה קטנה על ערך בסיס
            let baseRate = 1; // בסיס כלשהו, אפשר לשנות לפי הצורך

            // דוגמה לערכים קבועים עם סטייה קטנה
            if (from.code === 'USD' && to.code === 'ILS') baseRate = 3.65;
            else if (from.code === 'ILS' && to.code === 'USD') baseRate = 0.27;
            else if (from.code === 'USD' && to.code === 'EUR') baseRate = 0.92;
            else if (from.code === 'EUR' && to.code === 'USD') baseRate = 1.09;
            else if (from.code === 'USD' && to.code === 'GBP') baseRate = 0.79;
            else if (from.code === 'GBP' && to.code === 'USD') baseRate = 1.27;
            else if (from.code === 'USD' && to.code === 'JPY') baseRate = 151.62;
            else if (from.code === 'JPY' && to.code === 'USD') baseRate = 0.0066;
            else if (from.code === 'USD' && to.code === 'AUD') baseRate = 1.52;
            else if (from.code === 'AUD' && to.code === 'USD') baseRate = 0.66;
            else if (from.code === 'USD' && to.code === 'CAD') baseRate = 1.35;
            else if (from.code === 'CAD' && to.code === 'USD') baseRate = 0.74;
            else if (from.code === 'USD' && to.code === 'CHF') baseRate = 0.90;
            else if (from.code === 'CHF' && to.code === 'USD') baseRate = 1.11;
            else if (from.code === 'USD' && to.code === 'CNY') baseRate = 7.23;
            else if (from.code === 'CNY' && to.code === 'USD') baseRate = 0.14;
            else if (from.code === 'USD' && to.code === 'RUB') baseRate = 92.45;
            else if (from.code === 'RUB' && to.code === 'USD') baseRate = 0.011;
            else baseRate = (Math.random() * 5 + 0.5); // ברירת מחדל – אם אין התאמה ידועה


            // סטייה קטנה של ±0.05 מהערך הבסיסי
            const rate = (baseRate + (Math.random() * 0.1 - 0.05)).toFixed(4);

            sampleRates.push({
              from: from.code,
              to: to.code,
              rate: parseFloat(rate),
              created_at: formattedDate,
            });
          }
        });
      });
    }

    const stmt = db.prepare('INSERT INTO exchange_rates (from_currency, to_currency, rate, created_at) VALUES (?, ?, ?, ?)');
    sampleRates.forEach(r => stmt.run(r.from, r.to, r.rate, r.created_at));
    stmt.finalize(() => {
      console.log('Inserted sample exchange rates for the last month.');
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