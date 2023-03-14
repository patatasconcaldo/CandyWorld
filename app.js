// Import mongoose
var mongoose = require('mongoose');
// Instantiate MongoDB connection
const uri = 'mongodb://127.0.0.1/candyWorld';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
var db = mongoose.connection;
db.on('connecting', function () { console.log('Connecting to', uri); });
db.on('connected', function () { console.log('Connected to', uri); });
db.on('disconnecting', function () { console.log('Disconnecting from', uri); });
db.on('disconnected', function () { console.log('Disconnected from', uri); });
db.on('error', function (err) { console.error('Error:', err.message); });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Import express module
var express = require('express');

// Import path module
var path = require('path');

// Import logger module
var logger = require('morgan');

//Support cookie parsing
var cookieParser = require('cookie-parser');

//Instantiate the express middleware
var app = express();

var model = require('./model/model.js');
const { getUserById } = require('./model/model.js');

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Load logger module
app.use(logger('dev'));

// Set public folder to publish static content
app.use(express.static(path.join(__dirname, 'public')));





/////////////////////////   GET   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// Adds the / route to the application
app.get('/', function (req, res) {
    // Sends the Hello World string back to the client
    res.send('<p>Hello, World!</p>');
});

//Return all products
app.get('/api/products', function (req, res, next) {
    return Model.getProducts().then(function (products){
        return res.json(products);
    })
    
});

app.get('/api/products/id/:pid', function (req, res, next) {
    var pid = req.params.pid;
    return Model.getProductById(pid).then(function (product){
        return res.json(products);
    })
    
});

app.get('/api/cart', function (req, res, next) {
    var uid = req.cookies.uid;
    var productList = [];
    var shoppingCart = [];
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return model.getCartByUserId(uid).then(function (cart) {
        if (cart) {
            shoppingCart.push(cart);
            
            return res.json(shoppingCart);
        }
        return res.status(500).json({ message: 'Cannot retrieve user cart' });
    });
});


app.get('/api/cart/qty', function (req, res, next) {
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).json({ message: 'User has not signed in' });
    }
    return model.getCartQty(uid).then(function (aggregate) {
        if (aggregate.length > 0) {
            return res.json(aggregate[0].qty);
        }
        return res.status(500).json({ message: 'Cannot retrieve user cart quantity' });
    });
});

app.get('/api/users/profile', function (req, res, next) {
    let uid = req.cookies.uid;
    return Model.getUserById(uid).then(function(user){
        if (!user) {
            return res.status(401).send({ message: 'User has not signed in' });
        }

        if (user) {
            return res.json(user)
        }
    });
    

   
});

app.get('/api/orders', function (req, res, next) {
    let uid = req.cookies.uid;
    let orders;

    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getOrders(uid).then(function(orders){

        if (orders) {
            return res.json(orders);
        }
    
        return res.status(500).send({ message: 'Cannot retrieve user orders' });
    });

});

app.get('/api/orders/id/:oid', function (req, res, next) {
    let uid = req.cookies.uid;
    let oid = req.params.oid;
    let order;

    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.getOrder(uid, oid).then(function(order){
        if (order) {
            return res.json(order);
        }
        return res.status(500).send({ message: 'Cannot retrieve the order' });
    });

    
})

app.get(/\/.*/, function (req, res) {
    var matches = null;
    var templates = ['cart', 'order', 'profile', 'purchase', 'signin', 'signup'];
    if ((matches = req.path.match(/^\/$/)) ||
        ((matches = req.path.match(/^\/([^\/]*)\/?$/)) && ((templates) => {
            for (var i = 0; i < templates.length; i++) {
                if (templates.includes(templates[i])) {
                    return true;
                }
            }
            return false
        })))
        res.sendFile(path.join(__dirname, '/public/index.html'));
    else
        res.sendStatus(404);
});

app.get(/\/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

/////////////////////////   POST  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\


app.post('/api/users/signin', function (req, res, next) {
    return model.signin(req.body.email, req.body.password).then(function (user) {
        if (user) {
            res.cookie('uid', user._id);
            return res.json({});
        }
        return res.status(401).json({ message: 'Invalid credentials' });
    });
});

app.post('/api/cart/items/product/:pid', function (req, res, next) {
    var pid = req.params.pid;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).json({ message: 'User has not signed in' });
    }
    return Model.addItem(uid, pid).then(function (cart) {
        if (cart) {
            return res.json(cart);
        }
        return res.status(500).json({ message: 'Cannot add item to cart' });
    });
});

app.post('/api/users/signup', function (req, res, next) {
    return model.signup(req.body.name, req.body.surname, req.body.address,
        req.body.birth, req.body.email, req.body.password).then(function (user) {
            if (user) {
                return res.json(user._id);
            }
            return res.status(500).json({ message: 'Cannot create new user' });
        });
});



app.post('/api/orders', function (req, res, next) {
    let uid = req.cookies.uid;
    let user = getUserById(uid);
    let order = req.body.order;

    if (!user) {
        return res.status(401).send({
            message: 'User has not signed in'
        });
    }

    return Model.purchase(uid, order).then(function(order){
        if (order) {
            var oid = order._doc.number
            return res.json(oid)
        }
    
        return res.status(500).send({ message: 'Cannot add the new order' });
    });

    
})

///////////////////////// DELETES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
app.delete('/api/cart/items/product/:id', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.removeItem(uid, pid, false).then(function(cart){

        if (cart) {
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot remove item from cart' });
    });
});

app.delete('/api/cart/items/product/:id/all', function (req, res, next) {
    var pid = req.params.id;
    var uid = req.cookies.uid;
    if (!uid) {
        return res.status(401).send({ message: 'User has not signed in' });
    }
    return Model.removeItem(uid, pid, true).then(function(cart){

        if (cart) {
            return res.json(cart);
        }
        return res.status(500).send({ message: 'Cannot remove item from cart' });
    });
});

// Listen to port 3000

app.listen(3000, function () {
    console.log("Candy World Web app listening on port 3000!")
});