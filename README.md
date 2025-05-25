# 💱 Currency Converter System 🚀 Quick Start Guide

## 📁 Clone the repository and enter the project folder

```bash
git clone <repository-url>
cd currency-converter
```

## 🖥️ Server Setup

```bash
cd server
npm install
npm run init-db   # Run once to initialize the database
npm run dev       # Start the server in development mode (with hot reload)
```

## 💻 Client Setup

```bash
cd ../client
npm install
npm start         # Start the React client in development mode
```

## ⚙️ Environment Variables

Create a `.env` file inside the server folder (if it doesn't exist) with the following content:

```
PORT=3001
DB_PATH=./db.sqlite
EXCHANGE_API_KEY=d7b5c8ba798a78a0a0f754ea591ad32b
```

Note: The API key provided is for demonstration purposes. You should replace it with your own API key from [exchangerate.host](https://exchangerate.host).

⚠️ **API Limitations**: The free tier of exchangerate.host has some limitations:
- Limited number of requests per month
- Basic currency conversion features only
- No support for some advanced features
- Rate updates may be delayed


## 🧪 Running Server Tests (Optional)

```bash
cd ../server
npm test
```

📡 API Design

The system follows RESTful API design principles and includes two distinct types of endpoints:

    Internal Database Endpoints (/api/currencies, /api/rates, etc.)

        Allow client access to stored data from the local database

        Designed to be predictable, clean, and modular

    External API Proxy Endpoints (/api/external/live, /api/external/historical/:date)

        Server acts as a proxy to the public exchange rate API

        This avoids exposing the API key to the frontend and enables future enhancements like caching or rate limiting

This separation keeps responsibilities clear and makes the system more scalable and secure.
🚀 What I Would Improve with More Time

Given more time, I would:

    Integrate AI for Smart DB Seeding
    Instead of using static sample data, I would connect the database seeding process to an AI service that generates relevant exchange rate data based on the current date and the previous few days. This would simulate real-life data trends and make testing and demonstrations more meaningful.

    Add graph visualizations of currency trends over time

    Implement caching for external API results to improve performance and reduce rate-limit issues

    Add user accounts and preferences, such as favorite currencies

    Improve mobile responsiveness and accessibility

    Add support for more advanced conversion logic (e.g., fees, commissions)

    Add client-side tests to improve reliability and catch bugs early

    Implement full validation on the server side to ensure data integrity and security

    Enhance error handling for all failure cases to improve robustness

    Implement advanced security measures to protect against common vulnerabilities and attacks


## 🔍 Overcoming API Challenges

While integrating the external exchange rate API, I encountered several expected challenges with the integration. I first tried to resolve them on my own through direct investigation and debugging. When that didn't fully succeed, I turned to AI tools for assistance, but they were unable to provide a working solution.

As a result, I took the initiative to dive into the official documentation and relevant resources to thoroughly understand the API's behavior. This hands-on approach helped me solve the problems independently and significantly strengthened my server development and debugging skills.

## 🧩 Smart Database Design

To keep the system simple yet scalable, I used a **base-currency strategy**:

* Store only exchange rates relative to a fixed base currency (e.g., USD)
* Save currency codes and names in a minimal `currencies` table
* Convert between any two currencies by computing rates via the base (e.g., `USD → A`, `USD → B`, then calculate `A → B`)

This avoids storing redundant combinations and makes the system easier to maintain and update.

## System Overview
This is a full-stack currency conversion system that supports both real-time and historical exchange rates. The system consists of a Node.js/Express server with SQLite database and a React client.

## Database Structure

### Tables

1. **currencies**
   - `code` (TEXT, PRIMARY KEY): Currency code (e.g., USD, EUR)
   - `name` (TEXT): Currency name (e.g., US Dollar, Euro)

2. **exchange_rates**
   - `from_currency` (TEXT): Source currency code (Foreign Key to currencies.code)
   - `to_currency` (TEXT): Target currency code (Foreign Key to currencies.code)
   - `rate` (REAL): Exchange rate value
   - `created_at` (DATETIME): Timestamp of the rate

## API Endpoints

### Database Routes
1. **GET /api/currencies**
   - Returns all available currencies
   - Response: `{ currencies: [{ code, name }] }`

2. **GET /api/rates**
   - Returns all exchange rates
   - Response: `{ rates: [{ from_currency, to_currency, rate, created_at }] }`

3. **GET /api/convert**
   - Parameters: `from`, `to`, `amount`
   - Returns converted amount
   - Response: `{ result: number }`

### External API Routes (exchangerate.host)
1. **GET /api/external/live**
   - Returns real-time exchange rates
   - Response: `{ rates: { [currency]: rate } }`

2. **GET /api/external/historical/:date**
   - Returns historical exchange rates for a specific date
   - Response: `{ rates: { [currency]: rate } }`

## Client Components

1. **DbExchangeBox**
   - Handles currency conversion using database rates
   - Features: Currency selection, amount input, conversion display

2. **ApiExchangeBox**
   - Handles currency conversion using external API rates
   - Features: Real-time conversion, historical rates

3. **DbAllRatesTable**
   - Displays all exchange rates from the database
   - Features: Sorting, filtering, pagination

4. **ApiAllRatesTable**
   - Displays rates from external API
   - Features: Date selection, rate comparison

## System Logic

### Currency Conversion Flow
1. User selects source and target currencies
2. System fetches appropriate exchange rate
3. Conversion is performed using the formula: `amount * rate`
4. Result is displayed to user

### Rate Management
1. Database rates are stored with timestamps
2. External API rates are fetched on demand
3. Historical rates are available for past dates

### Error Handling
1. Invalid currency codes
2. API connection issues
3. Database errors
4. Invalid amounts

## Features
1. Real-time currency conversion
2. Historical exchange rates
3. Multiple currency support
4. Error handling and validation
5. Database and API rate management
6. User-friendly interface
7. Support for all currencies conversion
8. Manual rate updates

## Technical Stack
1. **Server**
   - Node.js
   - Express.js
   - SQLite3
   - Axios

2. **Client**
   - React.js
   - Bootstrap
   - Axios
   - React Router

3. **Development Tools**
   - npm
   - Git
   - VS Code 



   