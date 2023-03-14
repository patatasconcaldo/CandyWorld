var mongoose = require('mongoose');
var schema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    address: { type: String, required: true },
    birth: { type: Date, required: true },
    cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }]
});
module.exports = mongoose.model('User', schema);