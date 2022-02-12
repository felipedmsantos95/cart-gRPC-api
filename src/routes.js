const express = require('express')
const { celebrate, Segments, Joi } = require('celebrate')
const routes = express.Router()

const ProductController = require('./Controllers/ProductController')


//To list products
routes.get('/products', ProductController.index)
routes.post('/checkout', ProductController.checkout)


module.exports = routes