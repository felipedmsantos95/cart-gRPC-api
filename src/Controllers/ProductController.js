const ProductsRepository = require('../Repository/ProductRepository')
const CartRepository = require('../Repository/CartRepository')



module.exports = {
    index(request, response) {
        response.json(ProductsRepository.FindAll())
    },

    checkout(request, response){
        const { products } = request.body

        
        const totalAmount = CartRepository.TotalCart(products)


        response.json({ total_amount: totalAmount })
    }
}