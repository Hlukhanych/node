const createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const orderService = require('../services/orders.service');
const { OrderCreateSchema, OrderUpdateSchema } = require('../joi_validation_schemas/orders.schemas');
const multer = require('multer');

async function orderByIdValidation(req, res, next) {
    try {
        const { orderId } = req.params;

        if (!ObjectId.isValid(orderId)) {
            res.status(400).json({
                status: 400,
                err: createError.BadRequest("Order id is not valid"),
            })
            throw createError.BadRequest();
        }

        const order = await orderService.findById(orderId);

        if (!order) {
            throw createError.NotFound("Order with such id not found");
        }

        next();
    } catch(err) {
        next(err);
    }
}

const orderCreationDataValidation = async (req, res, next) => {
    try {
        const { error } = OrderCreateSchema.validate(req.body);

        if (error) {
            res.status(422).json({
                status: 422,
                err: createError.BadRequest(error.details[0].message),
            })
            throw createError.BadRequest();
        }

        const order = await orderService.findOne({
            $or: [
                { surname: req.body.surname },
                { product_name: req.body.product_name },
            ]
        });

        if (order) {
            throw createError.BadRequest("Order with such surname or product name already exist");
        }

        next();
    } catch (err) {
        next(err);
    }
}

const orderUpdateDataValidation = async (req, res, next) => {
    try {
        const { error } = OrderUpdateSchema.validate(req.body);

        if (error) {
            res.status(422).json({
                status: 422,
                err: createError.BadRequest(error.details[0].message),
            })
            throw createError.BadRequest();
        }

        if (req.body.surname || req.body.product_name) {
            const orExpressions = [];

            if (req.body.surname) {
                orExpressions.push({ surname: req.body.surname });
            }

            if (req.body.product_name) {
                orExpressions.push({ product_name: req.body.product_name });
            }

            const order = await orderService.findOne({
                _id: {
                    $ne: req.params.orderId
                },
                $or: orExpressions
            });

            if (order) {
                throw createError.BadRequest("Order with such surname or product name already exist");
            }
        }

        next();
    } catch (err) {
        next(err);
    }
}

const orderUploadProductPicture = multer({
    storage: multer.diskStorage({
        destination: 'public/productPicture/',
    }),
    limits: { fileSize: 100 * 1024 /* bytes */ },
    fileFilter: (req, file, callback) => {
        if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.mimetype)) {
            return callback(createError.BadRequest("File is not allowed"));
        }

        callback(null, true);
    }
}).single('file');

const ordersUpload = multer().single('file');

module.exports = {
    orderByIdValidation,
    orderCreationDataValidation,
    orderUpdateDataValidation,
    orderUploadProductPicture,
    ordersUpload,
}
