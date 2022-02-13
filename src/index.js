const dotenv = require('dotenv').config()
const app = require('./app')

const port = process.env.API_PORT || 3001

//Exclusive to make the backend run on the port regardless of the test script
console.log('[HASH CHALLENGE]')
app.listen(port)
console.log('[HTTP] Serviço em execução na porta:', port)