const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    address: {
        type: String,
        required: true,
    },
    owned: [String],
    editor: [String],
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Editor: Number,
        Admin: Number,
    },
    password: {
        type: String,
        required: true,
    },
    wallets: [walletSchema],
    refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
