const express = require('express');
const router = express.Router();

const controllers = require('../controllers/auth.controller');
const middlewares = require('../middlewares/auth.middleware');

router.route('/signin')
    .post(middlewares.signinDataValidation, controllers.signin);

router.route('/signout')
    .delete(controllers.signout);

module.exports = router;