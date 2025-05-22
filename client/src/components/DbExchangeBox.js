import React, { useState } from 'react';
import api from '../services/api';

// DbExchangeBox.js
// This component allows users to convert currencies and manually update rates using the local DB.

function DbExchangeBox({ currencies }) {
    // State for conversion
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [amount, setAmount] = useState(1);
    const [rate, setRate] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for manual update
    const [updateFrom, setUpdateFrom] = useState('USD');
    const [updateTo, setUpdateTo] = useState('EUR');
    const [manualRate, setManualRate] = useState('');
    const [updateMsg, setUpdateMsg] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchRate = async () => {
        setLoading(true);
        setError(null);
        setRate(null);
        setResult(null);
        try {
            const data = await api.getExchangeRate(fromCurrency, toCurrency, date);
            if (data.rate == null) {
                setError('No exchange rate data for the selected date');
                setRate(null);
                setResult(null);
                setLoading(false);
                return;
            }
            setRate(data.rate);
            setResult(amount * data.rate);
        } catch (err) {
            setError('Error loading data');
        }
        setLoading(false);
    };

    const updateRate = async () => {
        if (!manualRate || isNaN(manualRate) || manualRate <= 0) {
            setUpdateMsg('Please enter a valid value');
            return;
        }
        setUpdateLoading(true);
        setUpdateMsg(null);
        try {
            await api.updateExchangeRate(updateFrom, updateTo, parseFloat(manualRate));
            setManualRate('');
            setUpdateMsg('Value updated successfully!');
            if (updateFrom === fromCurrency && updateTo === toCurrency) {
                setDate(new Date().toISOString().slice(0, 10));
            }
        } catch (err) {
            setUpdateMsg('Error updating rate');
        }
        setUpdateLoading(false);
    };

    return (
        <div className="exchange-box db-box">
            <h2>Conversion (DB)</h2>
            <div className="exchange-form-vertical" style={{gap: '12px', display: 'flex', flexDirection: 'column'}}>
                <div className="input-group">
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
                </div>
                <div className="input-group">
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
                </div>
                <button onClick={fetchRate} disabled={loading}>Convert</button>
                {loading && <div>Loading...</div>}
                {rate && (
                    <div className="result">
                        <p>1 {fromCurrency} = {rate} {toCurrency}</p>
                        <p>{amount} {fromCurrency} = {result} {toCurrency}</p>
                    </div>
                )}
                {error && <div className="error">{error}</div>}
            </div>
            <hr className="divider" />
            <div className="exchange-form-vertical">
                <h3 style={{marginBottom: 0}}>Manual Rate Update</h3>
                <select value={updateFrom} onChange={e => setUpdateFrom(e.target.value)}>
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                </select>
                <select value={updateTo} onChange={e => setUpdateTo(e.target.value)}>
                    {currencies.map(c => (
                        <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                </select>
                <input
                    type="number"
                    value={manualRate}
                    onChange={e => setManualRate(e.target.value)}
                    placeholder="New value"
                    min="0"
                    step="0.000001"
                />
                <button onClick={updateRate} disabled={updateLoading}>Update Rate</button>
                {updateMsg && (
                    <div className={updateMsg === 'Value updated successfully!' ? 'success' : 'error'}>{updateMsg}</div>
                )}
            </div>
        </div>
    );
}

export default DbExchangeBox; 