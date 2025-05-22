import React, { useState, useEffect } from 'react';
import './App.css';
import DbExchangeBox from './components/DbExchangeBox';
import ApiExchangeBox from './components/ApiExchangeBox';
import ApiAllRatesTable from './components/ApiAllRatesTable';
import DbAllRatesTable from './components/DbAllRatesTable';
import api from './services/api';

function App() {
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const data = await api.getAllCurrencies();
                setCurrencies(data);
            } catch (err) {
                console.error('Error fetching currencies:', err);
                setError('שגיאה בטעינת רשימת המטבעות');
            }
            setLoading(false);
        };

        fetchCurrencies();
    }, []);

    if (loading) {
        return (
            <div className="container">
                <div className="loading"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Currency Converter</h1>
            <div className="exchange-boxes-grid">
                <DbExchangeBox currencies={currencies} />
                <ApiExchangeBox currencies={currencies} />
                <DbAllRatesTable currencies={currencies} />
                <ApiAllRatesTable currencies={currencies} />
            </div>
        </div>
    );
}

export default App;
