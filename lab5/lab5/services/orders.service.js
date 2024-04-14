const orderModel = require('../models/order.model');

async function create(order){
    const { _id } = await userModel.create(user);
    return _id;
}

async function find({ searchString = "", page = 1, perPage = 20 }) {
    if (searchString.trim() === "") {
        filter = {};
    } else {
        filter = {
            surname: { $regex: `^${searchString}`, $options: "gi" },
        };
    }

    return {
        items: await orderModel
            .find(filter, { password: 0, __v: 0 })
            .skip((page - 1) * perPage)
            .limit(Number(perPage)),
        count: await orderModel.countDocuments(filter),
    };
}

async function findById(id) {
    return orderModel.findById(id, { password: 0, __v: 0 });
}

async function findByIdAndUpdate(id, update) {
    return orderModel.findByIdAndUpdate(id, update, { upsert: false, new: true });
}

async function findByIdAndDelete(id) {
    return orderModel.findByIdAndDelete(id);
}

async function findOne(filter, projection = { password: 0, __v: 0 }) {
    return orderModel.findOne(filter, projection);
}

module.exports = {
    create,
    find,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
    findOne,
};