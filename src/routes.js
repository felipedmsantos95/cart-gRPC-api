const express = require('express')
const { celebrate, Segments, Joi } = require('celebrate')
const routes = express.Router()

const ProductController = require('./controllers/ProductController')


//To list products
routes.get('/products', ProductController.index)


module.exports = routes