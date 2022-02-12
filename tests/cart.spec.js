const request = require('supertest')
const app = require('../src/app')


//Testing cases for the cart entity
describe('CART', () => {
    

    it('should be able to checkout cart sent', async () => {
        const response = await request(app)
                .post('/checkout')
                .send({
                        products: [
                            {
                                id: 4,
                                quantity: 2
                            },
                            {
                                id: 2,
                                quantity: 2
                            }
                        ]
                    })

        
        expect(response.body).toHaveProperty('total_amount')
    })


    it('shouldn\'t be able to checkout with params with invalid data type', async () => {
        const response = await request(app)
                .post('/checkout')
                .send({        
                        products: 12,
                    })
                .expect(400)
    })

    it('shouldn\'t be able to checkout with missing params', async () => {
        const response = await request(app)
                .post('/checkout')
                .send({})
                .expect(400)  
    })

    it('should be able to get all products info at database', async () => {
        const response = await request(app)
                .get('/products')
        
        expect(response.body)
    })



})