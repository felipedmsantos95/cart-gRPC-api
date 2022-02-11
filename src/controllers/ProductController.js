const database = require('../database/products.json')


module.exports = {
    index(request, response){
        response.json(database)
    }
}