var logger = require('koa-logger'),
    koa = require('koa'),
    koabody = require('koa-body')(),
    router = require('koa-router')();

var config = require('./config');


const app = new koa();

var getStu = require('./controller/getInfo').getStu;
//var getSxw = require('./controller/getInfo').getSxw;
//var getLib = require('./controller/getInfo').getLib
var signIn = require('./controller/sign').signIn;
var signUp = require('./controller/sign').signUp;
var getScore = require('./controller/getInfo').getScore;
var getEcard = require('./controller/getInfo').getEcard;

var jwt    = require('jsonwebtoken');

app.use(logger());


router.get('/', function* (next){
	this.body = 'yr welcome';
})
.post('/signup', koabody, signUp)
.post('/signin', koabody, signIn) 
.get('/stu', getStu)
.get('/score',getScore)
.get('/getecard', getEcard);
// .get('/sxw', getSxw)
// .get('/lib', getLib)
// .get('*', function* (){
// 	this.body = "mising";
// })

//console.log('q')
app.use(router.routes());

app.listen('5555');
console.log('listening at 5555');