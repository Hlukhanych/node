var express = require('express');
var router = express.Router();

const controller = require('../controllers/orders.controller');
const middleware = require('../middlewares/orders.middleware');

router.route('/')
    .get(controller.getOrders)
    .post(middleware.orderCreationDataValidation, controller.createOrder)

router.route('/:orderId')
    .get(middleware.orderByIdValidation, controller.getOrder)
    .patch(middleware.orderUpdateDataValidation, controller.updateOrder)
    .delete(middleware.orderByIdValidation, controller.deleteOrder);

router.route('/:orderId/productPicture')
    .put(middleware.orderByIdValidation, middleware.orderUploadProductPicture, controller.updateOrderProductPicture);

router.route('/upload')
    .post(middleware.ordersUpload, controller.uploadOrders);

module.exports = router;
