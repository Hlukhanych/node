const config = require('../config');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = async (order) => {
    return jwt.sign({ id: order.id }, config.jwtSecret, { expiresIn: 24 * 60 * 60 });
};

const verifyAccessToken = async (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (err) {
        let message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        if (err.name === 'JsonWebTokenError') {
            message = 'Unauthorized';
        } else if (err.name === 'TokenExpiredError') {
            message = 'Session ended. Access token expired'
        }

        throw createError.Unauthorized(message);
    }
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
};