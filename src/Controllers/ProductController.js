const ProductsRepository = require('../Repository/ProductRepository')
const CartRepository = require('../Repository/CartRepository')


module.exports = {
    index(request, response) {
        response.status(200).send(ProductsRepository.FindAll())
    },

    async checkout(request, response){
        const { products } = request.body
       
        const { total_amount, total_amount_with_discount, total_discount, products_details } = await CartRepository.CartProductsDetails(products)

        const checkInvalidProduct = CartRepository.PickProductsNotFound(products_details)
       
        if(total_amount){
            response.status(200).send({ 
                total_amount,
                total_amount_with_discount,
                total_discount,
                products: products_details
            })
        }
        else {
            response.status(404).send(checkInvalidProduct)
        }
    }
}