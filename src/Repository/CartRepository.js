const ProductRepository = require('./ProductRepository')

module.exports = {

    TotalCart(products){
        const total = products.reduce((accumulator, product) => {
            const productPrice = ProductRepository.FindById(product.id).amount
            const productsTotal = product.quantity * productPrice
            return accumulator + productsTotal
        }, 0)

        return total
    },
}