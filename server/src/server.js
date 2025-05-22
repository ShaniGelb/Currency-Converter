const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const currencyRoutes = require('./routes/currencyRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 3002 : process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', currencyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Only start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; 