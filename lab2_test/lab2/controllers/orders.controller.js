const orderService = require('../services/orders.service');
const uuid = require('uuid');

async function createOrder(req, res) {
    try {
        const newOrderData = req.body;
        newOrderData.id = uuid.v4();
        const newOrder = await orderService.create(newOrderData);

        res.status(200).json({
            status: 200,
            data: newOrder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: err,
        });
    }
}

async function getOrders(req, res) {
    try {
        res.status(200).json({
            status: 200,
            data: await orderService.find(req.query),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: err,
        });
    }
}

async function getOrder(req, res) {
    try {
        const { orderId } = req.params;
        const order = await orderService.findById(orderId);

        if (!order) {
            return res.status(400).json({
                status: 400,
                message: 'Order not found.',
            });
        }

        res.status(200).json({
            status: 200,
            data: order,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: err,
        });
    }
}

async function updateOrder(req, res) {
    try {
        const { orderId } = req.params;
        const orderData = req.body;
        await orderService.findByIdAndUpdate(orderId, orderData);

        res.status(200).json({
            status: 200,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: err,
        });
    }
}

async function deleteOrder(req, res) {
    try {
        const { orderId } = req.params;
        await orderService.findByIdAndDelete(orderId);

        res.status(200).json({
            status: 200,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            error: err,
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
};
