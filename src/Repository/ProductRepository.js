const Products = require('../Database/products.json')

module.exports = {

    FindAll(){
        return Products
    },
    
    FindById(id) {
        const productIndex = Products.findIndex( product => product.id === id)
        if(productIndex != -1)
            return Products[productIndex]
        else
            return null
    },




}