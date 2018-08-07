var express = require('express');
var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');//做post请求数据处理包
// app.use(bodyParser.urlencoded({ extended: false }))
var jsonParser = bodyParser.json();

var multer = require('multer');//multer文件上传包
// var upload = multer({dest: 'uploads/'});//multer文件上传包

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};
var uploadFolder = './upload/';
createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        // cb(null, file.fieldname + '-' + Date.now());
        cb(null, file.originalname + '-' + Date.now());
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });


app.get('/index/:id', function (req, res) {
    res.send('This id ' + req.params.id);
});
app.get('/home', function (req, res) {
    console.dir(req.query);
    res.send('This id ' + req.query);
});
// app.post('/parser', function (req, res) {
//     console.dir(req.body);
//     res.send('This id ' + req.body.name);
// });
app.post('/parser', jsonParser, function (req, res) {
    console.dir(req.body);
    res.send('This id ' + req.body.name);
});


//图片上传
app.get('/form', function (req, res) {
    var form = fs.readFileSync('./upload.html', {encoding: 'utf8'});
    res.send(form);
});
app.post('/upload', upload.single('logo'), function (req, res) {
    var file = req.file;
    console.dir(file);
    res.send({rs_code: '0'});
});
app.listen(
    4000
);
console.log('success');