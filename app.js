var logger = require('koa-logger');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var router = require('koa-router')();
var config = require('./config');


const app = new koa();

//var getStu = require('./controller/getInfo').getStu;
//var getSxw = require('./controller/getInfo').getSxw;
//var getLib = require('./controller/getInfo').getLib
//var signIn = require('./controller/sign').signIn
var signUp = require('./controller/sign').signUp
//var getScore = require('./controller/getInfo').getScore

var jwt    = require('jsonwebtoken');

app.use(bodyParser());
app.use(logger());
app.use(router.routes());

router.get('/', function (next){
	this.body = 'yr welcome';
}).post('/signup', signUp)
// .post('/signin', signIn)
// 
// .get('/stu', getStu)
// .get('/score',getScore)
// .get('/sxw', getSxw)
// .get('/lib', getLib)
// .get('*', function* (){
// 	this.body = "mising";
// })

//console.log('q')


app.listen('5555');
console.log('listening at 5555');