const mongoose = require('mongoose');

const ItemSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    oriPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rfid: [{
        type: String,
        required: false
    }],
    thumbnail: {
        type: String,
        required: true
    },
    favouriteCount: {
        type: Number,
        required: false
    },
    stockCount: {
        type: Number,
        required: false,
        default: 0
    },
    soldCount: {
        type: Number,
        required: false,
        default: 0
    },
    availability: {
        type: Boolean,
        default: false,
        required: false
    }
    
},{timestamps: true});

const Item = mongoose.model('Item',ItemSchema);

module.exports = Item;