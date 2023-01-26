const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemCount: {
        type: Number,
        required: true
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    }
})

const PurchaseSchema  = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    packing: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'in progress'
    },
    checkout: [ItemSchema]

},{timestamps: true});

const Purchase = mongoose.model('Purchase',PurchaseSchema);

module.exports = Purchase;
