import React, { useState } from 'react';
import api from '../services/api';

// ApiAllRatesTable.js
// This component displays a table of all conversion rates from the external API for a selected base currency.

function ApiAllRatesTable({ currencies }) {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [amount, setAmount] = useState(1);
    const [rates, setRates] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRates = async () => {
        setLoading(true);
        setError(null);
        setRates(null);
        setLastUpdate(null);
        try {
            const data = await api.getAllExternalExchangeRates(fromCurrency);
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            setRates(data.rates);
            setLastUpdate(data.lastUpdate);
        } catch (err) {
            setError('Error loading data from external API');
        }
        setLoading(false);
    };

    return (
        <div className="exchange-box api-all-rates-box">
            <h2>All Currencies Conversion Table (External API)</h2>
            <div className="exchange-form-vertical">
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                />
                <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                </select>
                <button onClick={fetchRates} disabled={loading}>Show Table</button>
                {fromCurrency !== 'USD' && (
                    <div className="error">
                        Conversion table is only available for USD as the base currency (API limitation)
                    </div>
                )}
                {loading && <div>Loading...</div>}
                {error && <div className="error">{error}</div>}
                {rates && fromCurrency === 'USD' && (
                    <div className="rates-table-container">
                        <table className="rates-table">
                            <thead>
                                <tr>
                                    <th>Target Currency</th>
                                    <th>Rate</th>
                                    <th>Converted Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(rates).map(([key, usdToTarget]) => {
                                    const targetCode = key.replace('USD', '');
                                    if (targetCode === fromCurrency) return null;
                                    return (
                                        <tr key={targetCode}>
                                            <td>{targetCode}</td>
                                            <td>{usdToTarget}</td>
                                            <td>{(amount * usdToTarget).toFixed(4)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {lastUpdate && <p className="last-update">Last update: {lastUpdate}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApiAllRatesTable; 