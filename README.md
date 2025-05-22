. Clone the repository and enter the project folder:

git clone <repository-url>
cd currency-converter

2. Backend Setup (Server):

cd backend
npm install
npm run init-db      # לאתחול בסיס הנתונים
npm run dev          # להרצה בסביבת פיתוח עם hot reload

3. Frontend Setup (Client):

cd ../frontend
npm install
npm start            # להרצת ה-React או ה-frontend בסביבת פיתוח רגילה

4. Create .env file in the backend folder:

PORT=3000
DB_PATH=./db.sqlite
EXCHANGE_RATE_API_KEY=your_api_key

5. Run Backend Tests (Optional):

cd ../backend
npm test

## 🔍 Overcoming API Challenges

While integrating the external exchange rate API, I encountered several expected challenges with the integration. I first tried to resolve them on my own through direct investigation and debugging. When that didn't fully succeed, I turned to AI tools for assistance, but they were unable to provide a working solution.

As a result, I took the initiative to dive into the official documentation and relevant resources to thoroughly understand the API's behavior. This hands-on approach helped me solve the problems independently and significantly strengthened my backend development and debugging skills.

## 🧩 Smart Database Design

To keep the system simple yet scalable, I used a **base-currency strategy**:

* Store only exchange rates relative to a fixed base currency (e.g., USD)
* Save currency codes and names in a minimal `currencies` table
* Convert between any two currencies by computing rates via the base (e.g., `USD → A`, `USD → B`, then calculate `A → B`)

This avoids storing redundant combinations and makes the system easier to maintain and update.

## System Overview
This is a full-stack currency conversion system that supports both real-time and historical exchange rates. The system consists of a Node.js/Express backend with SQLite database and a React frontend.

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

## Frontend Components

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
4. Responsive design
5. Dark/Light mode
6. Error handling and validation
7. Database and API rate management
8. User-friendly interface

## Technical Stack
1. **Backend**
   - Node.js
   - Express.js
   - SQLite3
   - Axios

2. **Frontend**
   - React.js
   - Bootstrap
   - Axios
   - React Router

3. **Development Tools**
   - npm
   - Git
   - VS Code 



   