const userModel = require('../models/user.model');

async function create(user) {
    const { _id } = await userModel.create(user);
    return _id;
}

async function find() {
    return {
        items: await userModel.find({},{ password: 0, __v: 0 }),
        count: await userModel.countDocuments(),
    }
}

async function findById(id) {
    return userModel.findById(id, { password: 0, __v: 0 });
}

async function findByIdAndUpdate(id, update) {
    return userModel.findByIdAndUpdate(id, update, { upsert: false, new: true });
};

async function findByIdAndDelete(id) {
    return userModel.findByIdAndDelete(id);
};

async function findOne(filter, projection = { password: 0, __v: 0 }) {
    return userModel.findOne(filter, projection);
}

module.exports = {
    create,
    find,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
    findOne,
};