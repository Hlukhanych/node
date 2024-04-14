const express = require('express');
const router = express.Router();

const controllers = require('../controllers/users.controller');
const middlewares = require('../middlewares/users.middleware');
const { authenticationCheck } = require('../middlewares/auth.middleware');

router.route('/')
    .post(middlewares.userCreationDataValidation, controllers.createUser);

// Router-level middleware. Executed every time the app receives a request and checked authentication
router.use(authenticationCheck);

router.route('/')
    .get(controllers.getUsers);

router.route('/:userId')
    .get(middlewares.userByIdValidation, controllers.getUser)
    .patch(middlewares.userByIdValidation, middlewares.userUpdateDataValidation, controllers.updateUser)
    .delete(middlewares.userByIdValidation, controllers.deleteUser);

module.exports = router;