const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    favouriteItem: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Item'
    }]

},{timestamps: true});

const User = mongoose.model('User',UserSchema);

module.exports = User;
