const products = require('../Database/products.json')

module.exports = {

    FindAll(){
        return products
    },
    
    FindById(id) {
        const productIndex = products.findIndex( product => product.id === id)
        return products[productIndex]
    },




}