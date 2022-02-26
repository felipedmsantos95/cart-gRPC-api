const dotenv = require('dotenv').config();
const app = require('./app');

const PORT = process.env.API_PORT || 3001;
const HOST = '0.0.0.0';

// Exclusive to make the backend run on the port regardless of the test script
console.log('[HASH CHALLENGE]');
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
