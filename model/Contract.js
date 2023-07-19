const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addedUserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
    },
});

const contractSchema = new Schema({
    contractAddress: {
        type: String,
        required: true,
    },
    owner: {
        type: addedUserSchema,
        required: true,
    },
    addedUsers: {
        type: [addedUserSchema],
        required: true,
    },
});

module.exports = mongoose.model("Contract", contractSchema);
