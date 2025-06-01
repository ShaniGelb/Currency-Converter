import React, { useState } from 'react';
import api from '../services/api';

// ApiExchangeBox.js
// This component allows users to convert currencies using an external API.

function ApiExchangeBox({ currencies }) {
    // State for the conversion form (selected currencies, amount, date, etc.)
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState(1);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [rate, setRate] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    // Fetch exchange rate from the external API and calculate the result
    const fetchRate = async () => {
        setLoading(true);
        setError(null);
        setRate(null);
        setResult(null);
        setLastUpdate(null);
        try {
            const data = await api.getExternalExchangeRate(fromCurrency, toCurrency, amount, date);
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            setRate(data.rate);
            setResult(data.result);
            setLastUpdate(data.lastUpdate);
        } catch (err) {
            setError('Error loading data from external API');
        }
        setLoading(false);
    };

    // Render the conversion form and result
    return (
        <div className="exchange-box api-box">
            <h2>Conversion (External API)</h2>
            <div className="exchange-form-vertical">
                <input
                    type="number"
                    value={amount}
                    onChange={e => {
                        setAmount(e.target.value);
                        setRate(null);
                        setResult(null);
                        setError(null);
                    }}
                    min="0"
                    step="0.01"
                    placeholder="Amount"
                />
                <select value={fromCurrency} onChange={e => {
                    setFromCurrency(e.target.value);
                    setRate(null);
                    setResult(null);
                    setError(null);
                }}>
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                </select>
                <select value={toCurrency} onChange={e => {
                    setToCurrency(e.target.value);
                    setRate(null);
                    setResult(null);
                    setError(null);
                }}>
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={e => {
                        setDate(e.target.value);
                        setRate(null);
                        setResult(null);
                        setError(null);
                    }}
                />
                <button onClick={fetchRate} disabled={loading}>Convert</button>
                {loading && <div>Loading...</div>}
                {rate && (
                    <div className="result">
                        <p>1 {fromCurrency} = {rate} {toCurrency}</p>
                        <p>{amount} {fromCurrency} = {result} {toCurrency}</p>
                        {/* Show last update time if available */}
                        {lastUpdate && <p className="last-update">Last update: {lastUpdate}</p>}
                    </div>
                )}
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}

export default ApiExchangeBox; 