import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = {
    // Get all currencies
    getAllCurrencies: async () => {
        const response = await axios.get(`${API_URL}/currencies`);
        return response.data;
    },

    // Get exchange rate between two currencies (from DB)
    getExchangeRate: async (from, to, date = null) => {
        const params = { from, to };
        if (date) {
            params.date = date;
        }
        const response = await axios.get(`${API_URL}/exchange-rate`, { params });
        return response.data;
    },

    // Get exchange rate from external API (via backend)
    getExternalExchangeRate: async (from, to, amount = 1, date = null) => {
        const params = { from, to, amount };
        if (date) params.date = date;
        const response = await axios.get(`${API_URL}/external-exchange-rate`, { params });
        return response.data;
    },

    // Get historical exchange rates
    getHistoricalRates: async (from, to, startDate = null, endDate = null) => {
        const params = { from, to };
        if (startDate) {
            params.startDate = startDate;
        }
        if (endDate) {
            params.endDate = endDate;
        }
        const response = await axios.get(`${API_URL}/historical-rates`, { params });
        return response.data;
    },

    // Update exchange rate manually
    updateExchangeRate: async (from, to, rate) => {
        const response = await axios.put(`${API_URL}/exchange-rate`, { from, to, rate });
        return response.data;
    },

    // Fetch latest rates from external API
    fetchLatestRates: async () => {
        const response = await axios.post(`${API_URL}/fetch-latest-rates`);
        return response.data;
    },

    // Get all exchange rates from external API for a given base currency
    getAllExternalExchangeRates: async (from) => {
        const params = { from };
        const response = await axios.get(`${API_URL}/external-exchange-rates`, { params });
        return response.data;
    },

    // Get all exchange rates from DB for a given base currency (and optional date)
    getAllDbExchangeRates: async (from, date = null) => {
        const params = { from };
        if (date) params.date = date;
        const response = await axios.get(`${API_URL}/db-exchange-rates`, { params });
        return response.data;
    }
};

export default api; 