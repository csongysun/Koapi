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

exports.signIn = async function (ctx, next) {
    console.log(ctx);
	var id = ctx.query.id;
	var pwd = ctx.query.pwd;
	if (!id || !pwd) {
		return ctx.body = send(400, '缺少参数');
	}
	var user = await User.findById(id);
	if (!user) {
		return this.body = send(404, '无此记录');
	}

	if (pwd !== user.pwd) {
		return this.body = send(401, '密码错误');
	}

	delete user.rdate;
	delete user.password;
	delete user.__v;

	user.token = jwt.sign(user, skey, {
		expiresInMinutes: 1440
	});


	return this.body = send(1, 'success', user);

};



exports.signUp = async function (ctx, next) {
    var User = require('../model/index.js').User;
    console.log(ctx);
    debugger;
	email = ctx.query.email;
	pwd = ctx.query.pwd;
	stuid = ctx.query.stuid;
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

	var stu = await Stu.findById(stuid).populate('clazz').exec();
	if (!stu) {
		return this.body = send(401, '无此学号');
	}

	var user = new User({
		email: email,
		stuid: stuid,
		pwd: pwd,
		//nickname: nickname,
		//phone: phone,
		//epwd: epwd,
		//sex: sex
	});

	console.log(user);

	try {
		await user.save();
	} catch (e) {
		console.log(e);
		return this.body = send(400, e);
	}

	user = user.toObject();
    delete user.pwd;

	user.token = jwt.sign(user, skey, {
		expiresInMinutes: 1440 // expires in 24 hours
	});

	return this.body = send(1, 'success', user);
}