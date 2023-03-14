Model = {}

Model.getUserId = function () {
    var uid = RegExp('uid=[^;]+').exec(document.cookie);
    if (uid) {
        uid = decodeURIComponent(uid[0].replace(/^[^=]+./, ""));
        return uid;
    }
    return null;
};


Model.signout = function (event) {
    document.cookie = 'uid=;expires=0;path=/;'
    navigateTo(event,"/")
};

///////////////////////   GET   \\\\\\\\\\\\\\\\\\\\\\\\\\

Model.getProducts = function () {
    return $.ajax({ url: '/api/products', method: 'GET' });
};

Model.getCart = function () {
    return $.ajax({
        url: '/api/cart',
        method: 'GET'
    });
};

Model.getCartQty = function () {
    return $.ajax({
        url: '/api/cart/qty',
        method: 'GET'
    });
};

Model.getUserProfile = function () {
    return $.ajax({
        url: '/api/users/profile',
        method: 'GET'
    })
}


Model.getOrders = function(){
    return $.ajax({
        url: '/api/orders',
        method: 'GET'
    })
}

Model.getOrder = function(oid){
    return $.ajax({
        url: '/api/orders/id/' + oid,
        method: 'GET'
    })
}

Model.getProductById = function(pid){
    return $.ajax({
        url: '/api/products/id/' + pid
    })
}

///////////////////////   POST   \\\\\\\\\\\\\\\\\\\\\\\\\\

Model.signin = function (email, password) {
    return $.ajax({
        url: '/api/users/signin',
        method: 'POST',
        data: { email, password }
    });
};

Model.signup = function(name, surname, address, birth, email, password){
    return $.ajax({
        url: '/api/users/signup',
        method: 'POST',
        data: {name, surname, address, birth, email, password}
    })
}

Model.addItem = function (pid) {
    return $.ajax({
        url: '/api/cart/items/product/' + pid,
        method: 'POST'
    });
};

Model.addOrder = function (order) {
    return $.ajax({
        url: '/api/orders',
        method: 'POST',
        data: {order}
    })
}
///////////////////////   DELETE  \\\\\\\\\\\\\\\\\\\\\\\\\\

Model.removeItem = function (pid, all = false) {
    return $.ajax({
        url: '/api/cart/items/product/' + pid + (all ? '/all' : ''),
        method: 'DELETE'
    });
};