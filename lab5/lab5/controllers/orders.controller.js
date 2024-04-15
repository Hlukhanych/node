const orderService = require('../services/orders.service');
const createError = require('http-errors');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

async function createOrder(req, res, next) {
    try {
        const newOrderData = req.body;
        newOrderData.id = uuid.v4();
        const _id = await orderService.create({
            ...req.body,
            password: await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
        });

        res.status(200).json({
            status: 200,
            data: { _id },
        });
    } catch (err) {
        next(createError.InternalServerError(err.message));
    }
}

async function getOrders(req, res, next) {
    try {
        res.status(200).json({
            status: 200,
            data: await orderService.find(req.query),
        });
    } catch (err) {
        next(createError.InternalServerError(err.message));
    }
}

async function getOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        const order = await orderService.findById(orderId);

        if (!order) {
            return res.status(400).json({
                status: 400,
                error: {
                    message: 'User not found.'
                },
            });
        }

        res.status(200).json({
            status: 200,
            data: order,
        });
    } catch (err) {
        next(createError.InternalServerError(err.message));
    }
}

async function updateOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        const orderData = req.body;
        await orderService.findByIdAndUpdate(orderId, orderData);

        res.status(200).json({
            status: 200,
        });
    } catch (err) {
        next(createError.InternalServerError(err.message));
    }
}

async function deleteOrder(req, res, next) {
    try {
        const { orderId } = req.params;
        await orderService.findByIdAndDelete(orderId);

        res.status(200).json({
            status: 200,
        });
    } catch (err) {
        next(createError.InternalServerError(err.message));
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
};
