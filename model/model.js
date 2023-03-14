var mongoose = require('mongoose');
var User = require('./user');
var CartItem = require('./cartItem');
var Product = require('./product');
var Order = require('./order');
var OrderItem = require('./orderItem');

Model = {}

Model.user = null;

Model.signin = function (email, password) {
    return User.findOne({ email, password });
};

Model.signup = function (name, surname, address, birth, email, password) {
    return User.findOne({ email }).then(function (user) {
        if (!user) {
            var user = new User({
                email: email,
                password: password,
                name: name,
                surname: surname,
                birth: (new Date(birth)).getTime(),
                address: address,
                cartItems: []
            });
            return user.save();
        }
        return null;
    });
};

Model.getProducts = function () {

    var productList = []
    var item;
    return Product.find().then(function (products) {
        if (products) {
            for (var i = 0; i < products.length; i++) {
                item = products[i]._doc
                productList.push(products[i]._doc);
            }
            return productList;
        }
    });
}


Model.addItem = function (uid, pid) {
    return Promise.all([User.findById(uid).populate('cartItems'), Product.findById(pid)]).then(function (results) {
        var user = results[0];
        var product = results[1];
        if (user && product) {
            for (var i = 0; i < user.cartItems.length; i++) {
                var cartItem = user.cartItems[i];
                if (cartItem.product == pid) {
                    cartItem.qty++;
                    return cartItem.save().then(function () {
                        return user.cartItems;
                    });
                }
            }
            var cartItem = new CartItem({ qty: 1, product });
            user.cartItems.push(cartItem);
            return Promise.all([cartItem.save(), user.save()]).then(function (result) {
                return result[1].cartItems;
            });
        }
        return null;
    }).catch(function (err) { console.error(err); return null; });
};


/*
    This function remove one product of the cart, if it is just 1 then remove the
    product from the shopping cart
*/
Model.removeItem = function (uid, pid, all) {
    var cart = [];

    return Promise.all([User.findById(uid).populate('cartItems'), Product.findById(pid)]).then(function (results) {
        var user = results[0];
        var product = results[1];
        if (!all) {
            if (user && product) {
                for (var i = 0; i < user.cartItems.length; i++) {
                    var cartItem = user.cartItems[i];
                    if (cartItem.product == pid && cartItem.qty > 1) {
                        cartItem.qty--;
                        return cartItem.save().then(function () {
                            return user.cartItems;
                        });
                    } else if (cartItem.product == pid && cartItem.qty <= 1) {
                        user.cartItems.splice(i, 1);
                        return Promise.all([cartItem.save(), user.save()]).then(function (result) {
                            return result[1].cartItems;
                        });
                    }
                }
            }
        }

        for (var i = 0; i < user.cartItems.length; i++) {
            var cartItem = user.cartItems[i];
            if (cartItem.product == pid) {

                user.cartItems.splice(i, 1);
                return Promise.all([cartItem.save(), user.save()]).then(function (result) {
                    return result[1].cartItems;
                });
            }
        }
        user.save();
        return user.cartItems;

    }).catch(function (err) { console.error(err); return null; });
}


Model.purchase = function (uid, order) {
    return User.findById(uid).populate({ path: 'cartItems', populate: { path: 'product'}}).then(function (user) {
        if (!user) return null;
        var cart = user.cartItems;

        order = new Order({
            number: order.oid,
            date: order.date,
            address: order.address,
            cardNumber: order.cardNumber,
            cardHolder: order.cardHolder,
            orderItems: [],
            user: user
        });

        
        for (var i = 0; i < cart.length; i++) {
            order.orderItems.push({
                qty: cart[i].qty ,
                price: cart[i].product.price,
                tax: cart[i].product.price / 1.21,
                product: cart[i].product
            })
        }

        
        cart.splice(0, cart.length);
        return Promise.all([ user.save(), order.save()]).then(function () {
            return order;
        });

    }).catch(function (err) { console.error(err); return null; });

}

Model.getOrder = function (uid, oid) {
    return Order.find({ number: oid }).populate({ path: 'orderItems', populate: { path: 'product' }}).then(function(orders){
        
        if (orders) return orders;
    });
    return null;
}

Model.getUserById = function (uid) {

    return User.findById(uid).then(function(user){
        return user;
    });
}

Model.getCartQty = function (uid) {
    return User.aggregate([
        { $match: { "_id": mongoose.Types.ObjectId(uid) } },
        { $lookup: { from: 'cartitems', localField: 'cartItems', foreignField: '_id', as: 'cartItems' } },
        { $project: { qty: { $sum: "$cartItems.qty" } } }
    ]);
};



Model.getProductById = async function (pid) {

    return Product.findById(pid).then(function (product) {
        if (product) {
            return product;
        } else {
            return null;
        }
    });
};


Model.getCartByUserId = function (uid) {

    //Here I'm populating cartItems and product
    return User.findById(uid).populate({
        path: 'cartItems',
        populate: {
            path: 'product'
        }
    }).then(function (user) {
        if (user) {
            return user.cartItems;
        } else {
            return null;
        }
    });
}

Model.getOrders = function (uid) {
    return Order.find({ user: {_id: uid} }).populate({ path:'user'}).then(function(orders){
        if (orders) {
            return orders;
        }
        return null;
    });
    
}
module.exports = Model;
