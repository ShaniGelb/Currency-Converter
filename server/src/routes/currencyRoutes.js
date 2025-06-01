const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

// Get all currencies
router.get('/currencies', currencyController.getAllCurrencies);

// Get exchange rate between two currencies
router.get('/exchange-rate', currencyController.getExchangeRate);

// Update exchange rate manually
router.put('/exchange-rate', currencyController.updateExchangeRate);

// Fetch exchange rate from external API (without saving to DB)
router.get('/external-exchange-rate', currencyController.getExternalExchangeRate);

// Fetch all exchange rates from external API for a given base currency
router.get('/external-exchange-rates', currencyController.getAllExternalRates);

// Fetch all exchange rates from DB for a given base currency (and optional date)
router.get('/db-exchange-rates', currencyController.getAllDbRates);

module.exports = router;
