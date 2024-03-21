const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
    {
        id:{
            type: String,
            required: true,
            unique: true
        },
        surname: {
            type: String,
            required: false,
        },
        amount: {
            type: Number,
            required: false,
        },
        product_name: {
            type: String,
            required: false,
        },
        client_company: {
            type: String,
            required: false,
        },
        customer_surname: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model("orders", orderSchema, "orders");
