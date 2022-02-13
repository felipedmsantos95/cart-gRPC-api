const app = require('./app')
const port = 3000

//Exclusive to make the backend run on the port regardless of the test script
console.log('[HASH CHALLENGE]')
app.listen(port)
console.log('[HTTP] Serviço em execução na porta:', port)