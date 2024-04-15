const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const ordersService = require('../services/orders.service');
const authService = require('../services/auth.service');
const { SigninSchema } = require('../joi_validation_schemas/auth.schemas');

async function authenticationCheck(req, res, next) {
    try {
        if (!req.headers['x-auth']) {
            throw createError.Unauthorized('Access token is required');
        }

        req.auth = await authService.verifyAccessToken(req.headers['x-auth']);

        next();
    } catch(err) {
        next(err);
    }
}

async function signinDataValidation(req, res, next) {
    try {
        const { error } = SigninSchema.validate(req.body);

        if (error) {
            throw createError.BadRequest(error.details[0].message);
        }

        const { email, password } = req.body;

    const order = await ordersService.findOne({ email }, {});

    if (!order) {
        throw createError.NotFound('There is no User with such email');
    }

    const passwordCheck = await bcrypt.compare(password, order.password);

    if (!passwordCheck) {
        throw createError.Unauthorized('Incorrect password');
    }

    next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    authenticationCheck,
    signinDataValidation,
};