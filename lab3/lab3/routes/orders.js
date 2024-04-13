var express = require('express');
var router = express.Router();

const controller = require('../controllers/orders.controller');
const middleware = require('../middlewares/orders.middleware');

router.route('/')
    .get(controller.getOrders)
    .post(middleware.orderByAmountValidation, controller.createOrder)

router.route('/:orderId')
    .get(middleware.orderByIdValidation, controller.getOrder)
    .patch(middleware.orderByIdValidation, controller.updateOrder)
    .delete(middleware.orderByIdValidation, controller.deleteOrder);

module.exports = router;
