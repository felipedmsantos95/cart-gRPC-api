const ProductsRepository = require('../Repository/ProductRepository');
const CartService = require('../Services/CartService');

module.exports = {
    index(request, response) {
        response.status(200).send(ProductsRepository.FindAll());
    },

    async checkout(request, response) {
        const { products } = request.body;

        const { today_date } = request.headers;

        const checkBlackFriday = await CartService.BlackFridayCheck(
            products,
            today_date,
        );

        response.status(checkBlackFriday.status).send(checkBlackFriday.msg);
    },
};
