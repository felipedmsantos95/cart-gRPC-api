const ProductsRepository = require('../Repository/ProductRepository')
const CartRepository = require('../Repository/CartRepository')


module.exports = {
    index(request, response) {
        response.status(200).send(ProductsRepository.FindAll())
    },

    async checkout(request, response){
        const { products } = request.body
       
                
        const checkBlackFriday = await CartRepository.BlackFridayCheck(products)

        if(!checkBlackFriday.msg.total_amount && checkBlackFriday.msg.status === 404) {
            const checkInvalidProduct = CartRepository.PickProductsNotFound(checkBlackFriday.msg.products_details)
            response.status(checkInvalidProduct.status).send(checkInvalidProduct.msg)
        }        
        else {
            response.status(checkBlackFriday.status).send(checkBlackFriday.msg)
        }
    }
}