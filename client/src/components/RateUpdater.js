import React, { useState } from 'react';
import api from '../services/api';

function RateUpdater({ fromCurrency, toCurrency, onError, onRateUpdated }) {
    const [manualRate, setManualRate] = useState('');
    const [loading, setLoading] = useState(false);

    const updateRate = async () => {
        if (!manualRate || isNaN(manualRate) || manualRate <= 0) {
            onError('Please enter a valid rate');
            return;
        }

        setLoading(true);
        try {
            await api.updateExchangeRate(fromCurrency, toCurrency, parseFloat(manualRate));
            setManualRate('');
            if (onRateUpdated) {
                onRateUpdated();
            }
        } catch (err) {
            onError('Failed to update rate');
        }
        setLoading(false);
    };

    return (
        <div className="rate-update-container">
            <h2>Update Exchange Rate</h2>
            <div className="input-group">
                <input
                    type="number"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    placeholder="Enter new rate"
                    min="0"
                    step="0.000001"
                />
                <button onClick={updateRate} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Rate'}
                </button>
            </div>
        </div>
    );
}

export default RateUpdater; 