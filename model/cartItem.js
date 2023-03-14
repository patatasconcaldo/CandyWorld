var mongoose = require('mongoose');
var schema = mongoose.Schema({
    qty: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});
module.exports = mongoose.model('CartItem', schema);