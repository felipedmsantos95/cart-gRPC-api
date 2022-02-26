require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');

const blackFriday = process.env.BLACK_FRIDAY_DAY;

// Testing cases for the cart entity
describe('CART', () => {
    it('should be able to checkout cart with valid products', async () => {
        const response = await request(app)
            .post('/checkout')
            .send({
                products: [
                    {
                        id: 4,
                        quantity: 2,
                    },
                    {
                        id: 2,
                        quantity: 2,
                    },
                ],
            });

        expect(response.body).toHaveProperty('total_amount');
    });

    it("shouldn't be able to checkout with params with invalid data type", async () => {
        const response = await request(app)
            .post('/checkout')
            .send({
                products: 'This is not an array of objects',
            })
            .expect(400);
    });

    it("shouldn't be able to checkout with invalid products", async () => {
        const response = await request(app)
            .post('/checkout')
            .send({
                products: [
                    {
                        id: 50,
                        quantity: 1,
                    },
                    {
                        id: 3,
                        quantity: 3,
                    },
                    {
                        id: 4,
                        quantity: 1,
                    },
                ],
            })
            .expect(404);
    });

    it("shouldn't be able to checkout with missing params", async () => {
        const response = await request(app)
            .post('/checkout')
            .send({})
            .expect(400);
    });

    it('should be able to get all products info at database', async () => {
        const response = await request(app).get('/products');

        expect(response.body);
    });

    it('should be able to add a gift product if it is Black Friday', async () => {
        const response = await request(app)
            .post('/checkout')
            .set('today_date', blackFriday)
            .send({
                products: [
                    {
                        id: 5,
                        quantity: 1,
                    },
                    {
                        id: 3,
                        quantity: 3,
                    },
                    {
                        id: 6,
                        quantity: 1,
                    },
                ],
            })
            .expect(200);
    });

    it("shouldn't be able to add more than one gift product input if it is Black Friday", async () => {
        const response = await request(app)
            .post('/checkout')
            .set('today_date', blackFriday)
            .send({
                products: [
                    {
                        id: 5,
                        quantity: 1,
                    },
                    {
                        id: 3,
                        quantity: 3,
                    },
                    {
                        id: 6,
                        quantity: 1,
                    },
                    {
                        // Gift Product
                        id: 6,
                        quantity: 1,
                    },
                ],
            })
            .expect(400);
    });

    it("shouldn't be able to add more than one gift product in quantity if it is Black Friday", async () => {
        const response = await request(app)
            .post('/checkout')
            .set('today_date', blackFriday)
            .send({
                products: [
                    {
                        id: 5,
                        quantity: 1,
                    },
                    {
                        id: 3,
                        quantity: 3,
                    },
                    {
                        // Gift Product
                        id: 6,
                        quantity: 4,
                    },
                ],
            })
            .expect(400);
    });

    it("shouldn't be able to add gift product if it is NOT Black Friday", async () => {
        const response = await request(app)
            .post('/checkout')
            .set('today_date', '1950/02/14')
            .send({
                products: [
                    {
                        id: 5,
                        quantity: 1,
                    },
                    {
                        id: 3,
                        quantity: 3,
                    },
                    {
                        // Gift Product
                        id: 6,
                        quantity: 1,
                    },
                ],
            })
            .expect(400);
    });
});
