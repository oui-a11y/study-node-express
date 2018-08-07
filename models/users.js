var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    'userId': String,
    'userName': String,
    'userPwd': String,
    'orderList': Array,
    'cartList': [{
        "productId": String,
        "productName": String,
        "salePrice": Number,
        "productImage": String,
        "productUrl": String,
        'checked':String,
        'productNum':String
    }],
    'addressList':Array
});

module.exports = mongoose.model('user', userSchema, 'users');