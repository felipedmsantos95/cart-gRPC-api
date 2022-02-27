const CartService = require('../src/Services/CartService');

test('Calculate Discount', () => {
    expect(CartService.DiscountCalc(100, 0.05)).toEqual(5);

});

test('Calculate Total Cart', () => {
    expect(
        CartService.TotalCart([
            {
                id: 5,
                quantity: 1,
            },

            {
                id: 3,
                quantity: 2,
            },
        ])
    ).toEqual(163359);
});

test('Calculate Total Cart with 0 quantity', () => {
    expect(
        CartService.TotalCart([
            {
                id: 5,
                quantity: 0,
            },

            {
                id: 3,
                quantity: 0,
            },
        ])
    ).toEqual(0);
});

test('Detecting Invalid Products', () => {
    expect(
        CartService.PickProductsNotFound({
            is_invalid: true,
            products_details: [
                { invalid: 50 },
                {
                    id: 3,
                    quantity: 0,
                    unit_amount: 60356,
                    total_amount: 0,
                    discount: 0,
                    is_gift: false,
                },
            ]
        })).toEqual({
            status: 404,
            msg: {
                validation: {
                    message: [
                        'O produto de id 50 não está cadastrado em nosso banco de dados',
                    ],
                },
            },
        })
});
