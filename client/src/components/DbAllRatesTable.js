import React, { useState } from 'react';
import api from '../services/api';

// DbAllRatesTable.js
// This component displays a table of all conversion rates from the DB for a selected base currency and date.

function DbAllRatesTable({ currencies }) {
    // State for the table form (base currency, amount, date, etc.)
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [amount, setAmount] = useState(1);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all exchange rates from the local database for the selected base currency and date
    const fetchRates = async () => {
        setLoading(true);
        setError(null);
        setRates(null);
        try {
            const data = await api.getAllDbExchangeRates(fromCurrency, date);
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            setRates(data.rates);
        } catch (err) {
            setError('Error loading data from DB');
        }
        setLoading(false);
    };

    // Render the table form and the rates table
    return (
        <div className="exchange-box db-all-rates-box">
            <h2>All Currencies Conversion Table (DB)</h2>
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
                <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
                <button onClick={fetchRates} disabled={loading}>Show Table</button>
                {loading && <div>Loading...</div>}
                {error && <div className="error">{error}</div>}
                {/* Render the rates table if data is available */}
                {rates && (
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
                                {/* Row for base currency to itself */}
                                <tr>
                                    <td>{fromCurrency}</td>
                                    <td>1</td>
                                    <td>{Number(amount).toFixed(4)}</td>
                                </tr>
                                {/* Render each target currency row */}
                                {Object.keys(rates).map(target => {
                                    if (target === fromCurrency) return null;
                                    // If there is a direct rate, or calculate via USD as an intermediate
                                    if (rates[target] && target !== 'USD' && rates['USD']) {
                                        // Calculate rate via USD
                                        const baseToUsd = rates['USD']; // fromCurrency -> USD
                                        const usdToTarget = rates[target]; // USD -> target
                                        const baseToTarget = usdToTarget / baseToUsd;
                                        return (
                                            <tr key={target}>
                                                <td>{target}</td>
                                                <td>{baseToTarget}</td>
                                                <td>{(amount * baseToTarget).toFixed(4)}</td>
                                            </tr>
                                        );
                                    } else if (rates[target]) {
                                        // Direct rate
                                        return (
                                            <tr key={target}>
                                                <td>{target}</td>
                                                <td>{rates[target]}</td>
                                                <td>{(amount * rates[target]).toFixed(4)}</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DbAllRatesTable; 