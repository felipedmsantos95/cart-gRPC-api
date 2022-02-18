const test = require('tape')
const CartRepository = require('../src/Repository/CartRepository')



test('Calculate Discount', (t) => {
    t.assert(CartRepository.DiscountCalc(100, 0.05) == 5, 'Correct Discount')
    t.end()
})

test('Calculate Total Cart', (t) => {
    t.assert(CartRepository.TotalCart(
        [
            {
                id: 5,
                quantity: 1
            },
                
              {
                id: 3,
                quantity: 2
            }
        ]
    ) == 163359, 'Correct Total Cart')
    t.end()
})


test('Calculate Total Cart with 0 quantity', (t) => {
    t.assert(CartRepository.TotalCart(
        [
            {
                id: 5,
                quantity: 0
            },
                
              {
                id: 3,
                quantity: 0
            }
        ]
    ) == 0, 'Correct Total Cart')
    t.end()
})


test('Detecting Invalid Products', (t) => {
    t.deepEqual(CartRepository.PickProductsNotFound(
        [
            { invalid: 50 },
            {
              id: 3,
              quantity: 0,
              unit_amount: 60356,
              total_amount: 0,
              discount: 0,
              is_gift: false
            }
          ]
    ) , {
        status: 404,
        msg:{

            validation: {
              message: [
                "O produto de id 50 não está cadastrado em nosso banco de dados"
              ]
            }
          }
    }, 'Invalid Product detected')
    t.end()
})





