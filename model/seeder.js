var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uri = 'mongodb://127.0.0.1/candyWorld';
var db = mongoose.connection;
var User = require('./user');
var CartItem = require('./cartItem');
var Product = require('./product');
var Order = require('./order');
var OrderItem = require('./orderItem');

db.on('connecting', function () {
    console.log('Connecting to', uri);
});
db.on('connected', function () {
    console.log('Connected to', uri);
});
db.on('disconnecting', function () {
    console.log('Disconnecting from', uri);
});
db.on('disconnected', function () {
    console.log('Disconnected from', uri);
});
db.on('error', function (err) {
    console.error('Error:', err.message);
});
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    var cartItems = [];
    var user = new User({
        email: 'johndoe@example.com', password: '1234', name: 'John', surname: 'Doe', birth:
            Date.UTC(1990, 0, 1), address: '123 Main St, 12345 New York, United States', cartItems: cartItems
    });



    return CartItem.deleteMany()
        .then(function () { return User.deleteMany({}); })
        .then(function () { return user.save(); })
        .then(function () { return Product.deleteMany({}); })
        .then(function () { return Order.deleteMany({}); })
        .then(function () { return OrderItem.deleteMany({}); })
        .then(function () {
            return Product.insertMany(
                [{

                    title: 'Choco Crunchy',
                    url: '../images/products/fini-choco-crunchy-10-bolsas-de-115g.jpg',
                    description: 'Chocolate balls witch cereals!',
                    price: 4.5
                },
                {

                    title: 'The Black Spiros',
                    url: '../images/products/fini-spiro-regaliz-vegano-10-bolsas-de-180g.jpg',
                    description: 'There are the new black liquorice spiros!',
                    price: 1.95
                },
                {

                    title: 'Mikado',
                    url: '../images/products/lu-mikado-chocolate-con-leche-24-estuches-de-39g.jpg',
                    description: 'Who doesn\'t know Mikados?!',
                    price: 6
                },
                {

                    title: 'm&m\'s Tablet',
                    url: '../images/products/mm-s-tabletas-cacahuete-16-unidades.jpg',
                    description: 'A chocolate bar with m&m\'s!',
                    price: 3.2
                },
                {

                    title: 'Nutella\'s Biscuits',
                    url: '../images/products/nutella-biscuits-10-unidades.jpg',
                    description: 'Just a delicious cookies filled with chocolate!',
                    price: 7
                },
                {

                    title: 'White Oreos',
                    url: '../images/products/oreo-banadas-blanco-24-packs-de-2-galletas.jpg',
                    description: 'Oreos covered with delicious white chocolate!',
                    price: 2
                },
                {

                    title: 'Gusanitos',
                    url: '../images/products/risi-gusanitos-familiar-8-bolsas-de-85g.jpg',
                    description: 'Be careful, they might be alive!',
                    price: 0.35
                },
                {

                    title: 'Chocolate bar',
                    url: '../images/products/conguitos-cream-16-unidades.jpg',
                    description: 'A chocolate bar filled with Conguito\'s cream!',
                    price: 3
                }

                ]);
        })
        .then(function () { return mongoose.disconnect(); });
});