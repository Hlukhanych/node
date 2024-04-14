const createError = require('http-errors');

async function authenticationCheck(req, res, next) {
    if (req.headers['x-auth'] !== "12345") {
        return next(createError.Unauthorized('Application access token is required'));
    }

    next();
}

module.exports = {
    authenticationCheck,
};