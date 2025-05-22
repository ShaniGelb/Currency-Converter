const request = require('supertest');
const express = require('express');
const cors = require('cors');
const currencyRoutes = require('../routes/currencyRoutes');
const db = require('../config/database');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', currencyRoutes);

describe('Currency API Tests', () => {
  beforeAll(async () => {
    // Ensure database is ready
    await db.serialize(() => {
      db.run('PRAGMA foreign_keys = ON');
    });
  });

  afterAll(async () => {
    // Close database connection
    await db.close();
  });

  // Test getting all currencies
  describe('GET /api/currencies', () => {
    it('should return all currencies as an array of objects', async () => {
      const response = await request(app)
        .get('/api/currencies')
        .expect(200);

      // Should be an array
      expect(Array.isArray(response.body)).toBe(true);
      // Should have at least one currency
      expect(response.body.length).toBeGreaterThan(0);
      // Should have code and name
      expect(response.body[0]).toHaveProperty('code');
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  // Test getting all DB exchange rates
  describe('GET /api/db-exchange-rates', () => {
    it('should return all exchange rates as an object', async () => {
      const response = await request(app)
        .get('/api/db-exchange-rates?from=USD&date=2025-05-22')
        .expect(200);
      console.log('db-exchange-rates response:', response.body);
      expect(typeof response.body).toBe('object');
      expect(response.body).toHaveProperty('rates');
    });
  });

  // Test currency conversion (POST)
  describe('POST /api/convert-currency', () => {
    it('should handle invalid currency codes (expect 404 or 400)', async () => {
      const response = await request(app)
        .post('/api/convert-currency')
        .send({
          sourceCurrency: 'INVALID',
          targetCurrency: 'EUR',
          amount: 100
        });
      // Accept 400 or 404
      expect([400, 404]).toContain(response.status);
      // Should have error message
      expect(response.body).toBeDefined();
    });
  });

  // Test external API endpoints
  describe('GET /api/external-exchange-rates', () => {
    it('should return live exchange rates as an object', async () => {
      const response = await request(app)
        .get('/api/external-exchange-rates?from=USD&date=2025-05-22')
        .expect(200);
      console.log('external-exchange-rates response:', response.body);
      expect(typeof response.body).toBe('object');
      expect(response.body).toHaveProperty('rates');
    });
  });

  describe('GET /api/historical-rates', () => {
    it('should return historical exchange rates as an array', async () => {
      const response = await request(app)
        .get('/api/historical-rates?from=USD&to=EUR&startDate=2025-05-01&endDate=2025-05-22')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
