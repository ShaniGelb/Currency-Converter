const db = require('../config/database');
const axios = require('axios');

const EXCHANGE_API_BASE = 'https://api.exchangerate.host';

// currencyController.js
// This controller handles all currency-related API endpoints: fetching currencies, converting, updating rates, etc.

const currencyController = {
  /**
   * Get all available currencies from the DB.
   * GET /currencies
   */
  getAllCurrencies: async (req, res) => {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM currencies', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      res.json(rows);
    } catch (err) {
      console.error('getAllCurrencies error:', err);
      res.status(500).json({ error: 'Failed to fetch currencies' });
    }
  },

  /**
   * Convert currency using DB rates (direct or via USD).
   * POST /convert-currency
   * Body: { sourceCurrency, targetCurrency, amount }
   */
  convertCurrency: async (req, res) => {
    const { sourceCurrency, targetCurrency, amount } = req.body;

    if (!sourceCurrency || !targetCurrency || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      // שלוף את ה-id של המטבעות
      const source = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM currencies WHERE code = ?', [sourceCurrency], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      const target = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM currencies WHERE code = ?', [targetCurrency], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      const usd = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM currencies WHERE code = ?', ['USD'], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!source || !target || !usd) {
        return res.status(404).json({ error: 'Currency not found' });
      }

      // נסה שער ישיר
      const direct = await new Promise((resolve, reject) => {
        db.get(
          'SELECT rate FROM exchange_rates WHERE base_currency_id = ? AND target_currency_id = ?',
          [source.id, target.id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });
      if (direct) {
        const convertedAmount = amount * direct.rate;
        return res.json({
          sourceCurrency,
          targetCurrency,
          amount,
          convertedAmount,
          rate: direct.rate
        });
      }

      // נסה דרך USD
      if (source.id !== usd.id && target.id !== usd.id) {
        const toUsd = await new Promise((resolve, reject) => {
          db.get(
            'SELECT rate FROM exchange_rates WHERE base_currency_id = ? AND target_currency_id = ?',
            [source.id, usd.id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            }
          );
        });
        const fromUsd = await new Promise((resolve, reject) => {
          db.get(
            'SELECT rate FROM exchange_rates WHERE base_currency_id = ? AND target_currency_id = ?',
            [usd.id, target.id],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            }
          );
        });
        if (toUsd && fromUsd) {
          const convertedAmount = amount * toUsd.rate * fromUsd.rate;
          return res.json({
            sourceCurrency,
            targetCurrency,
            amount,
            convertedAmount,
            rate: toUsd.rate * fromUsd.rate
          });
        }
      }

      return res.status(404).json({ error: 'Exchange rate not found' });
    } catch (error) {
      console.error('Error converting currency:', error);
      res.status(500).json({ error: 'Failed to convert currency' });
    }
  },

  /**
   * Update an exchange rate manually in the DB.
   * PUT /exchange-rate
   * Body: { from, to, rate }
   */
  updateExchangeRate: async (req, res) => {
    const { from, to, rate } = req.body;
    if (!from || !to || !rate) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    try {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO exchange_rates (from_currency, to_currency, rate, created_at) VALUES (?, ?, ?, datetime("now"))',
          [from, to, rate],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
      res.json({ message: 'Rate updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update rate' });
    }
  },

  /**
   * Get the latest exchange rate between two currencies (optionally by date).
   * GET /exchange-rate?from=USD&to=EUR&date=2025-05-22
   */
  getExchangeRate: async (req, res) => {
    const { from, to, date } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    try {
      let query = 'SELECT * FROM exchange_rates WHERE from_currency = ? AND to_currency = ?';
      let params = [from, to];
      if (date) {
        query += ' AND date(created_at) = ? ORDER BY created_at DESC LIMIT 1';
        params.push(date);
      } else {
        query += ' ORDER BY created_at DESC LIMIT 1';
      }
      const row = await new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      if (!row) {
        return res.json({ rate: null, error: 'Rate not found' });
      }
      res.json({ rate: row.rate, created_at: row.created_at });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch exchange rate' });
    }
  },

  /**
   * Get historical exchange rates between two currencies for a date range.
   * GET /historical-rates?from=USD&to=EUR&startDate=2025-05-01&endDate=2025-05-22
   */
  getHistoricalRates: async (req, res) => {
    const { from, to, startDate, endDate } = req.query;
    if (!from || !to || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all(
          'SELECT * FROM exchange_rates WHERE from_currency = ? AND to_currency = ? AND date(created_at) BETWEEN ? AND ? ORDER BY created_at ASC',
          [from, to, startDate, endDate],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch historical rates' });
    }
  },

  /**
   * Fetch latest rates from the external API and update the DB.
   * POST /fetch-latest-rates
   */
  fetchLatestRatesFromApi: async (req, res) => {
    try {
      // Example: Use exchangerate.host free API
      const response = await axios.get(`${EXCHANGE_API_BASE}/latest?base=USD`);
      const rates = response.data.rates;
      const [currencies] = await db.query('SELECT code FROM currencies');
      const currencyCodes = currencies.map(c => c.code);
      const now = new Date();
      for (const from of currencyCodes) {
        if (from === 'USD') {
          for (const to of currencyCodes) {
            if (to !== 'USD' && rates[to]) {
              await db.query(
                'INSERT INTO exchange_rates (from_currency, to_currency, rate, created_at) VALUES (?, ?, ?, ?)',
                [from, to, rates[to], now]
              );
            }
          }
        }
      }
      res.json({ message: 'Latest rates fetched and updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch latest rates from API' });
    }
  },

  /**
   * Get exchange rate from the external API (without saving to DB).
   * GET /external-exchange-rate?from=USD&to=EUR&date=2025-05-22
   */
  getExternalExchangeRate: async (req, res) => {
    const { from, to, amount = 1, date } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    try {
      const ACCESS_KEY = process.env.EXCHANGE_API_KEY;
      let url;
      if (date) {
        // Use /historical endpoint for historical rates
        url = `${EXCHANGE_API_BASE}/historical?access_key=${ACCESS_KEY}&date=${date}&base=${from}&symbols=${to}`;
      } else {
        // Use /live endpoint for current rates
        url = `${EXCHANGE_API_BASE}/live?access_key=${ACCESS_KEY}&base=${from}&symbols=${to}`;
      }
      console.log('exchangerate.host URL:', url);
      const response = await axios.get(url);
      console.log('exchangerate.host response:', response.data);

      let rate = null;
      let lastUpdate = null;
      if (date) {
        // /historical returns quotes like { USDILS: 3.5 }
        if (response.data && response.data.success && response.data.quotes) {
          const key = `${from}${to}`;
          rate = response.data.quotes[key];
          lastUpdate = response.data.date;
        }
      } else {
        // /live returns quotes like { USDILS: 3.5 }
        if (response.data && response.data.success && response.data.quotes) {
          const key = `${from}${to}`;
          rate = response.data.quotes[key];
          lastUpdate = response.data.timestamp;
        }
      }
      if (!rate) {
        return res.json({ rate: null, error: 'No data from exchangerate.host for this request' });
      }
      res.json({
        rate,
        result: amount * rate,
        lastUpdate
      });
    } catch (err) {
      console.error('External API error:', err.message);
      res.status(500).json({ error: 'Failed to fetch rate from external API' });
    }
  },

  /**
   * Get all conversion rates from the external API for a given base currency.
   * GET /external-exchange-rates?from=USD
   */
  getAllExternalRates: async (req, res) => {
    const { from } = req.query;
    if (!from) {
      return res.status(400).json({ error: 'Missing base currency' });
    }
    try {
      const ACCESS_KEY = process.env.EXCHANGE_API_KEY;
      const url = `${EXCHANGE_API_BASE}/live?access_key=${ACCESS_KEY}&base=${from}`;
      console.log('exchangerate.host URL (all rates):', url);
      const response = await axios.get(url);
      console.log('exchangerate.host response (all rates):', response.data);
      if (!response.data || !response.data.success || !response.data.quotes) {
        return res.json({ rates: null, error: 'No data from exchangerate.host for this request' });
      }
      // quotes: { USDILS: 3.5, USDEUR: 0.9, ... }
      const rates = {};
      Object.entries(response.data.quotes).forEach(([key, value]) => {
        // key is like USDILS, extract the target currency
        const target = key.replace(from, '');
        rates[target] = value;
      });
      res.json({ base: from, rates, lastUpdate: response.data.timestamp });
    } catch (err) {
      console.error('External API error (all rates):', err.message);
      res.status(500).json({ error: 'Failed to fetch all rates from external API' });
    }
  },

  /**
   * Get all exchange rates from the DB for a given base currency (and optional date).
   * GET /db-exchange-rates?from=USD&date=2025-05-22
   */
  getAllDbRates: async (req, res) => {
    const { from, date } = req.query;
    if (!from) {
      return res.status(400).json({ error: 'Missing base currency' });
    }
    try {
      let query = 'SELECT * FROM exchange_rates WHERE from_currency = ?';
      let params = [from];
      if (date) {
        query += ' AND date(created_at) = ?';
        params.push(date);
      }
      const rows = await new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
      const rates = {};
      rows.forEach(row => {
        rates[row.to_currency] = row.rate;
      });
      res.json({ base: from, rates, date: date || null });
    } catch (err) {
      console.error('DB error (all rates):', err.message);
      res.status(500).json({ error: 'Failed to fetch all rates from DB' });
    }
  }
};

module.exports = currencyController; 