var mongoose = require('mongoose');
var schema = mongoose.Schema({

    title: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    tax: { type: Number, required: true }


});
module.exports = mongoose.model('OrderItem', schema);