const Joi = require('joi');

const UserCreateSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
        .min(6)
        .max(10),
});

const UserUpdateSchema = Joi.object({
    email: Joi.string()
        .email(),
});

module.exports = {
    UserCreateSchema,
    UserUpdateSchema,
};