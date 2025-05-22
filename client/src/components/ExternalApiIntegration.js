import React, { useState } from 'react';
import api from '../services/api';

function ExternalApiIntegration({ onError, onRatesUpdated }) {
    const [loading, setLoading] = useState(false);

    const fetchLatestRates = async () => {
        setLoading(true);
        try {
            await api.fetchLatestRates();
            if (onRatesUpdated) {
                onRatesUpdated();
            }
        } catch (err) {
            onError('Failed to fetch latest rates');
        }
        setLoading(false);
    };

    return (
        <div className="external-api-container">
            <h2>External API Integration</h2>
            <button onClick={fetchLatestRates} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Latest Rates from API'}
            </button>
        </div>
    );
}

export default ExternalApiIntegration; 