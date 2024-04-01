const createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const orderService = require('../services/orders.service');
const { OrderCreateSchema, OrderUpdateSchema } = require('../joi_validation_schemas/orders.schemas');

async function orderByIdValidation(req, res, next) {
    try {
        const { orderId } = req.params;

        if (!ObjectId.isValid(orderId)) {
            throw createError.BadRequest("Order id is not valid");
        }

        const order = await orderService.findById(orderId);

        if (!order) {
            throw createError.NotFound("Order with such id not found");
        }

        next();
    } catch(err) {
        next(err);
    }
}

const orderCreationDataValidation = async (req, res, next) => {
    try {
        const { error } = OrderCreateSchema.validate(req.body);

        if (error) {
            throw createError.BadRequest(error.details[0].message);
        }

        const order = await orderService.findOne({
            $or: [
                { surname: req.body.surname },
                { product_name: req.body.product_name },
            ]
        });

        if (order) {
            throw createError.BadRequest("Order with such surname or product name already exist");
        }

        next();
    } catch (err) {
        next(err);
    }
};

const orderUpdateDataValidation = async (req, res, next) => {
    try {
        const { error } = OrderUpdateSchema.validate(req.body);

        if (error) {
            throw createError.BadRequest(error.details[0].message);
        }

        if (req.body.surname || req.body.product_name) {
            const orExpressions = [];

            if (req.body.surname) {
                orExpressions.push({ surname: req.body.surname });
            }

            if (req.body.product_name) {
                orExpressions.push({ product_name: req.body.product_name });
            }

            const order = await orderService.findOne({
                _id: {
                    $ne: req.params.orderId
                },
                $or: orExpressions
            });

            if (order) {
                throw createError.BadRequest("Order with such surname or product name already exist");
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    orderByIdValidation,
    orderCreationDataValidation,
    orderUpdateDataValidation
}
