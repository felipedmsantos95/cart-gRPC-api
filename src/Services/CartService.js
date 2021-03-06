const ProductRepository = require('../Repository/ProductRepository');
const DiscountService = require('./DiscountClient');

const blackFriday = process.env.BLACK_FRIDAY_DAY;

function TotalCart(products) {
    const total = products.reduce((accumulator, product) => {
        if (ProductRepository.FindById(product.id)) {
            const currentProduct = ProductRepository.FindById(product.id);

            let productPrice = currentProduct.amount;

            // In blackfriday, is_gift flaged products must be added in cart by free
            if (currentProduct.is_gift) productPrice = 0;

            const productsTotal = product.quantity * productPrice;

            return accumulator + productsTotal;
        }
    }, 0);

    return total;
}

function DiscountCalc(amount, percent) {
    return Math.round(amount * percent);
}

// Format Product details view on output
async function ProductDetails(product) {
    let serviceDiscount = { percentage: 0 };

    // Verify if discount service is avaliable
    try {
        serviceDiscount = await DiscountService.GetServiceDiscount(product.id);
    } catch (err) {
        console.log(
            `[DISCOUNT SERVICE] Não foi possivel aplicar desconto para o produto de ID ${product.id}, serviço indisponível`,
        );
    }

    const productExists = ProductRepository.FindById(product.id);

    if (productExists) {
        let { id, amount, is_gift } = productExists;

        // It must be only one gift product input and it is free
        if (is_gift) {
            amount = 0;
        }

        const totalAmount = product.quantity * amount;

        // Apply discount if service is avaliable
        let productDiscount = this.DiscountCalc(
            totalAmount,
            serviceDiscount.percentage,
        );

        //To prevent some errored response from gRPC server
        if (!productDiscount) productDiscount = 0;

        return {
            id,
            quantity: product.quantity,
            unit_amount: amount,
            total_amount: totalAmount,
            discount: productDiscount,
            is_gift,
        };
    } else return { invalid: product.id };
}

// Applying formatted view in all products and verify total discount
async function CartProductsDetails(products) {
    let totalDiscount = 0;
    let isInvalid = false; // Verifiy if in cast there is only valid products

    const detailsPromisses = products.map(async product => {
        const productDetails = await this.ProductDetails(product);

        if (productDetails.invalid) {
            isInvalid = true;
        }

        totalDiscount += productDetails.discount;
        return productDetails;
    });

    const details = await Promise.all(detailsPromisses);

    const totalAmount = this.TotalCart(products);

    const totalAmountDiscont = totalAmount - totalDiscount;

    if (isInvalid) {
        return {
            is_invalid: true,
            products_details: details,
        };
    }
    return {
        total_amount: totalAmount,
        total_amount_with_discount: totalAmountDiscont,
        total_discount: totalDiscount,
        products_details: details,
    };
}

// Verify wich products are not registered in our datase
function PickProductsNotFound(cartChekout) {

    const productsOutput = cartChekout.products_details;

    const arrayOfInvalids = productsOutput
        .filter(product => {
            if ('invalid' in product) {
                return true;
            }
        })
        .map(productInvalid => {
            return `O produto de id ${productInvalid.invalid} não está cadastrado em nosso banco de dados`;
        });

    return {
        status: 404,
        msg: { validation: { message: arrayOfInvalids } },
    };
}

function IsBlackFriday(headerDate) {
    if (headerDate) today = new Date(headerDate).toLocaleDateString();
    else today = new Date().toLocaleDateString();

    const dayBlackFriday = new Date(blackFriday).toLocaleDateString();
    return today == dayBlackFriday;
}

function ShouldIGiveAGift(cartChekout) {
    const productsOutput = cartChekout.products_details;

    // Verify wich products are gift
    const arrayOfInvalids = productsOutput
        .filter(product => {
            if (product.is_gift) {
                return true;
            }
        })
        .map(productInvalid => {
            return `O produto de id ${productInvalid.id} é um brinde de black friday e não pode ser adicionado ao carrinho por enquanto...`;
        });
    if (arrayOfInvalids.length == 0) {
        return { status: 200, msg: cartChekout };
    }
    return {
        status: 400,
        msg: { validation: { message: arrayOfInvalids } },
    };
}

function VerifyGiftProductsOnCart(cartChekout) {
    const productsOutput = cartChekout.products_details;

    const arrayOfGifts = productsOutput.filter(product => {
        if (product.is_gift) {
            return true;
        }
    });

    if (
        arrayOfGifts.length > 1 ||
        (arrayOfGifts[0] && arrayOfGifts[0].quantity > 1)
    )
        // Verifiy if has more than one gift products in quantity or ids
        return {
            status: 400,
            msg: {
                validation: {
                    message: [
                        `Só pode haver a quantidade de 1 produto brinde na blackfriday.`,
                    ],
                },
            },
        };
    return { status: 200, msg: cartChekout };
}
//If date comes from request headers
async function CheckoutCart(products, headerDate) {
    const CartChekout = await this.CartProductsDetails(products);

    // Verify if there is any invalid product in cart
    if (CartChekout.is_invalid) {
        return this.PickProductsNotFound(CartChekout);
    }

    if (this.IsBlackFriday(headerDate)) {
        return this.VerifyGiftProductsOnCart(CartChekout);
    }

    return this.ShouldIGiveAGift(CartChekout);
}
module.exports = {
    TotalCart,
    DiscountCalc,
    ProductDetails,
    CartProductsDetails,
    PickProductsNotFound,
    IsBlackFriday,
    ShouldIGiveAGift,
    VerifyGiftProductsOnCart,
    CheckoutCart,
};
