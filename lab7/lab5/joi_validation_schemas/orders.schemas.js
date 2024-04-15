const Joi = require('joi');

const OrderCreateSchema = Joi.object({
    surname: Joi.string()
        .min(3)
        .max(30),

    amount: Joi.number()
        .positive()
        .precision(2),

    product_name: Joi.string()
        .regex(/^[_ a-z0-9A-Z]+$/)
        .min(4)
        .max(30),

    client_company: Joi.string()
        .min(4)
        .max(20),

    customer_surname: Joi.string()
        .min(3)
        .max(30)
})

const OrderUpdateSchema = Joi.object({
    surname: Joi.string()
        .min(3)
        .max(30),

    amount: Joi.number()
        .positive()
        .precision(2),

    product_name: Joi.string()
        .alphanum()
        .min(4)
        .max(30),

    client_company: Joi.string()
        .min(4)
        .max(20),

    customer_surname: Joi.string()
        .min(3)
        .max(30)
})

module.exports = {
    OrderCreateSchema,
    OrderUpdateSchema
}