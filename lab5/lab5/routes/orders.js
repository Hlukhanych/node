var express = require('express');
var router = express.Router();

const controllers = require('../controllers/orders.controller');
const middlewares = require('../middlewares/orders.middleware');
const { authenticationCheck } = require('../middlewares/auth.middleware');

router.route('/')
    .get(controllers.getOrders)
    .post(middlewares.orderCreationDataValidation, controllers.createOrder)

router.use(authenticationCheck);

router.route('/:orderId')
    .get(middlewares.orderByIdValidation, controllers.getOrder)
    .patch(middlewares.orderUpdateDataValidation, controllers.updateOrder)
    .delete(middlewares.orderByIdValidation, controllers.deleteOrder);

module.exports = router;
