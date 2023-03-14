var mongoose = require('mongoose');
var schema = mongoose.Schema({

    number: { type: String, required: true },
    date: { type: String, required: true },
    address: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cardHolder: { type: String, required: true },
    orderItems: {

        type: [{
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            tax: { type: Number, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
        }]

    },
    user: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }

});
module.exports = mongoose.model('Order', schema);