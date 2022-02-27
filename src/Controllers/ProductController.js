const ProductsRepository = require('../Repository/ProductRepository');
const CartService = require('../Services/CartService');

function index(request, response) {
    response.status(200).send(ProductsRepository.FindAll());
}

async function checkout(request, response) {
    const { products } = request.body;

    const { today_date } = request.headers;

    const checkoutCart = await CartService.CheckoutCart(products, today_date);

    response.status(checkoutCart.status).send(checkoutCart.msg);
}

module.exports = {
    index,
    checkout,
};
