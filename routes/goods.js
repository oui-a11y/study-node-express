var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');//做post请求数据处理包
// app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});
//商品列表
var goods = require('../models/goods');
//用户model
var user = require('../models/users');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1/demo');
//查看是否连接成功;

mongoose.connection.on('error', function (err) {
    console.log('数据库连接失败' + err);
});
mongoose.connection.on('connected', function () {
    console.log('数据库连接成功');
});

mongoose.connection.on('open', function () {
    console.log('数据库连接成功');
});
mongoose.connection.on('disconnected', function () {
    console.log('数据库断开连接');
});
/* GET home page. */
router.get('/', function (req, res, next) {
    var sort = req.param('sort');
    var currentPage = parseInt(req.param('currentPage'));
    var pageSize = parseInt(req.param('pageSize'));
    var skipNum = (currentPage - 1) * pageSize;
    var pararms = {};
    var priceGt = parseInt(req.param('priceGt'));
    var priceLte = parseInt(req.param('priceLte'));
    // if(!(priceGt === 0 && priceLte === 0)){
    //     pararms = {
    //         salePrice:{
    //             $gt:priceGt,
    //             $lte:priceLte
    //         }
    //     }
    // }
    goods.find(pararms).skip(skipNum).limit(pageSize).sort({'salePrice': sort}).exec(function (err, data) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: data.length,
                    data: data
                }
            });
        }
    })
    // goods.find({},function (err,data) {
    //     if(err){
    //         res.json({
    //             status:'1',
    //             msg:err.message
    //         });
    //     }else{
    //         res.json({
    //             status:'0',
    //             msg:'',
    //             result:{
    //                 count:data.length,
    //                 data:data
    //             }
    //         });
    //     }
    // });
    // res.render('index', {title: 'Express'});
});

//购物车提交
router.get('/addCart', function (req, res, next) {
    var userId = '102';
    productId = req.body.productId;
    console.log(1111);

    user.findOne({'userId': userId}, function (err, userDoc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            });
        } else {
            console.log('userDoc' + userDoc);
            if(userDoc){
                let goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                });
                if(goodsItem){
                    userDoc.save(function (err2,doc2) {
                        if(err2){
                            res.json({
                                status:'1',
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:'0',
                                msg:'',
                                result:'success'
                            })
                        }
                    })
                }else{
                    goods.findOne({productId:productId},function (err1,doc) {
                        if(err1){
                            res.json({
                                status:'1',
                                msg:err1.message
                            })
                        }else{
                            if(doc){
                                doc.productNum = 1;
                                doc.checked = 1;
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err3,doc3) {
                                    if(err3){
                                        res.json({
                                            status:'1',
                                            msg:err3.message
                                        })
                                    }else{
                                        res.json({
                                            status:'0',
                                            msg:'',
                                            result:'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
            res.json({
                status: '0',
                msg: '',
                result: {
                    data: data
                }
            });
        }

    });
});

module.exports = router;