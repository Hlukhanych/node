const orderModel = require('../models/order.model');

async function create(order){
    return orderModel.create(order);
}

async function find({ searchString = "", page = 1, perPage = 20 }) {
    if (searchString.trim() === "") {
        // Handle the case when searchString is an empty string
        filter = {};
    } else {
        // Use the regular expression filter
        filter = {
            surname: { $regex: `^${searchString}`, $options: "gi" },
        };
    }

    return {
        items: await orderModel
            .find(filter)
            .skip((page - 1) * perPage)
            .limit(Number(perPage)),
        count: await orderModel.countDocuments(filter),
    };
}

async function findById(id) {
    return orderModel.findById(id);
}

async function findByIdAndUpdate(id, update) {
    return orderModel.findByIdAndUpdate(id, update, { upsert: false, new: true });
}

async function findByIdAndDelete(id) {
    return orderModel.findByIdAndDelete(id);
}

module.exports = {
    create,
    find,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
};