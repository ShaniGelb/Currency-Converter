## Running Automated Tests

To run the backend automated tests:

1. Make sure you have installed all dependencies:
   ```bash
   npm install
   ```
2. Make sure the database is initialized and contains sample data (run your DB init script if needed):
   ```bash
   npm run init-db
   ```
3. Run the tests:
   ```bash
   npm test
   ```

- All tests should pass (5/5) if the project is set up correctly.
- The tests use Jest and Supertest and do not require the server to be running in a separate process.
- If you see a warning about an open handle (TLSWRAP), you can ignore it. 