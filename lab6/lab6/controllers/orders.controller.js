const orderService = require('../services/orders.service');
const createError = require('http-errors');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const deleteFileAsync = promisify(fs.unlink);

async function createOrder(req, res, next) {
    try {
        const newOrderData = req.body;
        newOrderData.id = uuid.v4();
        const newOrder = await orderService.create(newOrderData);

        res.status(200).json({
            status: 200,
            data: newOrder,
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

async function updateOrderProductPicture(req, res, next) {
    try {
        const { orderId } = req.params;

        console.log(req.file);

        // delete previous picture
        const order = await orderService.findById(orderId);
        if (order.productPicture) {
            const filePath = path.join(__dirname, '..', 'public', 'productPicture', order.productPicture);
            await deleteFileAsync(filePath);
        }

        // update
        orderService.findByIdAndUpdate(orderId, { productPicture: req.file.filename });

        res.status(200).json({
            status: 200,
        });
    } catch(err) {
        next(createError.InternalServerError(err.message));
    }
}

async function uploadOrders(req, res, next) {
    try {
        console.log(req.file);
        const jsonData = JSON.parse(req.file.buffer.toString());
        // todo: save data to DB
        res.json(jsonData);
    } catch(err) {
        next(createError.InternalServerError(err.message));
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder,
    updateOrderProductPicture,
    uploadOrders
};
