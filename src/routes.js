const express = require('express')
const routes = express.Router()
const { celebrate, Segments, Joi } = require('celebrate')


const ProductController = require('./Controllers/ProductController')


//To list products
routes.get('/products', ProductController.index)


//Validate body request
const productInCart = Joi.object().keys({
    id: Joi.number().required()
                    .messages({
                        'number.base': `"id" deve ser um número`,
                        'number.empty': `"id" não pode estar vazio`,
                        'any.required': `"id" é um campo obrigatório`,                   
                    }),
    quantity: Joi.number().required()
                        .messages({
                            'number.base': `"quantity" deve ser um número`,
                            'number.empty': `"quantity" não pode estar vazio`,
                            'any.required': `"quantity" é um campo obrigatório`,                   
                        }),
})

routes.post('/checkout', celebrate({
                            [Segments.BODY]: 
                                Joi.object().keys({
                                    products: Joi.array().items(productInCart).required()
                                                
                                })
                            }), ProductController.checkout)


module.exports = routes