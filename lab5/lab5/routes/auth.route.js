const express = require('express');
const router = express.Router();

const controllers = require('../controllers/auth.controller');
const midllewares = require('../middlewares/auth.middleware');

router.route('/signin')
    .post(midllewares.signinDataValidation, controllers.signin);

router.route('/signout')
    .delete(controllers.signout);

module.exports = router;