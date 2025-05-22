import React, { useState } from 'react';
import api from '../services/api';

function HistoricalRates({ fromCurrency, toCurrency, onError }) {
    const [historicalRates, setHistoricalRates] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchHistoricalRates = async () => {
        setLoading(true);
        try {
            const data = await api.getHistoricalRates(fromCurrency, toCurrency, startDate, endDate);
            setHistoricalRates(data);
        } catch (err) {
            onError('Failed to fetch historical rates');
        }
        setLoading(false);
    };

    return (
        <div className="historical-rates-container">
            <h2>Historical Rates</h2>
            <div className="date-range">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start Date"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End Date"
                />
                <button onClick={fetchHistoricalRates} disabled={loading}>
                    {loading ? 'Loading...' : 'Get Historical Rates'}
                </button>
            </div>
            
            {historicalRates.length > 0 && (
                <div className="historical-rates-list">
                    <h3>Rate History</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicalRates.map((rate, index) => (
                                <tr key={index}>
                                    <td>{new Date(rate.created_at).toLocaleDateString()}</td>
                                    <td>{rate.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HistoricalRates; 