const createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const orderService = require('../services/orders.service');
const {create} = require("../services/orders.service");

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

async function orderByAmountValidation(req, res, next){
    try {
        const order = req.body;

        if( order["amount"] < 0 ) {
            const error = createError.BadRequest("Order amount < 0");
            throw JSON.stringify(error);
        }
        else {
            order.create();
        }

        next();
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    orderByIdValidation,
    orderByAmountValidation
}
