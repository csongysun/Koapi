var User = require('../model/index.js').User;
var jwt = require('jsonwebtoken');
var validator = require('../commen/validator');
var skey = require('../config').skey;
var Stu = require('../model/index.js').Stu;

function send(status, msg, content) {
	return {
		status: status,
		msg: msg,
		content: content
	}
}

function lean(ref){
   // delete ref._id;
    delete ref.pwd;
	delete ref.__v;
    return ref;
}

exports.signIn = function * (next) {
	var email = this.request.body.email;
	var pwd = this.request.body.pwd;
	if (!email || !pwd) {
		return this.body = send(400, '缺少参数');
	}
	var user = yield User.findById(email).lean().exec();
	if (!user) {
		return this.body = send(404, '无此记录');
	}

	if (pwd !== user.pwd) {
		return this.body = send(401, '密码错误');
	}
    
    user = lean(user);

	user.token = jwt.sign(user, skey, {
		expiresIn: 1440*60
	});

	return this.body = send(1, 'success', user);

};



exports.signUp = function* (next) {
	email = this.request.body.email;
	pwd = this.request.body.pwd;
	stuid = this.request.body.stuid;
	// nickname = this.request.body.nickname,
	// phone = this.request.body.phone,
	// epwd = this.request.body.epwd,
	// sex = this.request.body.sex

	// if (!_id || !pwd || !stuid || !nickname) {
	// 	return this.body = send(400, '缺少参数');
	// }
    if (!email || !pwd || !stuid) {
		return this.body = send(400, '缺少参数');
	}

	email = validator.trim(email).toLowerCase();
	pwd = validator.trim(pwd);
	stuid = validator.trim(stuid);
	//nickname = validator.trim(nickname);

	// if (!validator.isEmail(_id) || !validator.isPwd(pwd) || validator.isWeird(nickname) || !validator.isStuid(stuid)) {
	// 	return this.body = send(400, '参数不合法');
	// }
    	if (!validator.isEmail(email) || !validator.isPwd(pwd) || !validator.isStuid(stuid)) {
		return this.body = send(400, '参数不合法');
	}

	var stu = yield Stu.findById(stuid).populate('clazz').exec();
	if (!stu) {
		return this.body = send(401, '无此学号');
	}

	var user = new User({
		_id: email,
		stuid: stuid,
		pwd: pwd,
		//nickname: nickname,
		//phone: phone,
		//epwd: epwd,
		//sex: sex
	});

	console.log(user);

	try {
		yield user.save();
	} catch (e) {
		console.log(e);
		return this.body = send(400, e);
	}

	user = user.toObject();

	user.token = jwt.sign(user, skey, {
		expiresIn: 1440*60 // expires in 24 hours
	});

	return this.body = send(1, 'success', user);
}