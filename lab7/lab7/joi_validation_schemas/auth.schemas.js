const Joi = require('joi');

const SigninSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(10)
        .required()
});

module.exports = {
    SigninSchema,
};