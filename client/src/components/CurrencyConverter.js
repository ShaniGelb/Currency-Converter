import React, { useState, useEffect } from 'react';
import api from '../services/api';

function CurrencyConverter({ currencies, onError }) {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState(1);
    const [rate, setRate] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        if (fromCurrency && toCurrency) {
            fetchRate();
        }
    }, [fromCurrency, toCurrency, selectedDate]);

    const fetchRate = async () => {
        setLoading(true);
        try {
            const data = await api.getExchangeRate(fromCurrency, toCurrency, selectedDate);
            setRate(data.rate);
            setResult(amount * data.rate);
        } catch (err) {
            onError('Failed to fetch exchange rate');
        }
        setLoading(false);
    };

    return (
        <div className="converter-container">
            <div className="input-group">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                />
                <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                >
                    {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="date-selector">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                rate && (
                    <div className="result">
                        <p>1 {fromCurrency} = {rate} {toCurrency}</p>
                        <p>{amount} {fromCurrency} = {result} {toCurrency}</p>
                    </div>
                )
            )}
        </div>
    );
}

export default CurrencyConverter; 