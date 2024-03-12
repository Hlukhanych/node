var express = require('express');
var router = express.Router();

const controller = require('../controllers/orders.controller');

router.route('/')
    .get(controller.getOrders)
    .post(controller.createOrder)

router.route('/:orderId')
    .get(controller.getOrder)
    .put(controller.updateOrder)
    .delete(controller.deleteOrder)

module.exports = router;
