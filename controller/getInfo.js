var Clazz = require('../model/index.js').Clazz;
var Stu = require('../model/index.js').Stu;
var superagent = require('superagent-charset');
var cheerio = require('cheerio');

function send(status, msg, content) {
	return {
		status: status,
		msg: msg,
		content: content
	}
}

exports.getStu = function * (next) {
	//var res = {};
	var stuid = this.request.query.sid;
	if (!stuid) {
		return this.body = send(400, '缺少参数');
		// res.status = 400;
		// res.msg = '缺少参数';
		// this.body = res;
	}
	var stu = yield Stu.findById(stuid).populate('clazz').exec();

	if (!stu) {
		return this.body = send(404, '无此记录');
	}

	console.log(JSON.stringify(stu.toObject(), null, '\t'));

	return this.body = send(1, '查询成功', stu.toObject());

	//this.body = stu.toObject();
};

//双学位
exports.getSxw = function * (next) {
	var stuid = this.request.query.sid;
	if (!stuid) {
		return this.body = send(400, '缺少参数');
	}

	var items = yield getCookie(stuid).then(getSxwInfo);

	if (items) {
		return this.body = send(1, '查询成功', items);
	}

	this.body = send(500, 'error');
}

exports.getScore = function * (next) {
	var stuid = this.request.query.sid;
	var term = this.request.query.term||'2014.2';
	if (!stuid) {
		return this.body = send(400, '缺少参数');
	}

	var items = yield getScoreInfo(stuid, term);
	console.log(items===null);
	if(items === null) 	return this.body = send(404,'查询失败');
	this.body = send(1,'查询成功', items);
}

function getScoreInfo(sid, term) {
	return new Promise(function(resolve, reject) {
		superagent.get('http://jwc.ecjtu.jx.cn/mis_o/cj.php?sid=' + sid)
			.end(function(err, sres) {
				if (err) {
					resolve(null);
					return;
				}
				var obj = eval(sres.text);
				var con = [];
				for (var x in obj) {
					var item = obj[x];
					//  console.log(obj[x]);
					if (item["Term"] === term) {
						//  console.log(1);
						//  console.log(item[]);
						con.push({
							course: item["Course"],
							score: item["Score"],
							score1: item["FirstScore"],
							score2: item["SecondScore"],
							pass: item["Pass"]
						})
					}
				}
				resolve(con);
		});
	})
}

function getCookie(sid) {
	return new Promise(function(resolve, reject) {
		superagent.post('http://jwc.ecjtu.jx.cn/mis_o/login.php')
			.send("user=jwc&pass=jwc&Submit=%CC%E1%BD%BB")
			.end(function(err, sres) {
				if (err) {
					reject(err);
				}
				resolve({
					cookie: sres.header['set-cookie'],
					sid: sid
				});
			});
	});
}

function getSxwInfo(param) {
	return new Promise(function(resolve, reject) {
		superagent.post('http://jwc.ecjtu.jx.cn/mis_o/tdquery.php')
			.send("StuID=" + param.sid)
			.charset('gb2312')
			.set("Cookie", param.cookie)
			.end(function(err, res) {
				if (err) reject(err);
				//resolve(res.text);
				var items = [];
				var $ = cheerio.load(res.text);
				$('table').last().attr('id', 't2');
				var tb = $('#t2 tr');
				console.log(tb.html());
				var row = tb.length;
				for (var i = 1; i < row; i++) {
					var t = tb.eq(i).find('td');
					items.push({
						term: t.eq(0).text(),
						id: t.eq(1).text(),
						name: t.eq(2).text(),
						course: t.eq(3).text(),
						isN: t.eq(4).text(),
						credit: t.eq(5).text(),
						score: t.eq(6).text(),
						score1: t.eq(7).text(),
						score2: t.eq(8).text()
					});
				}

				// .children().each(function(idx, elem) {
				// 	var $elem = $(elem).children();
				// 	items.push({
				// 		term: $elem.eq(0).text(),
				// 		id: $elem.eq(1).text(),
				// 		name: $elem.eq(2).text(),
				// 		course: $elem.eq(3).text(),
				// 		isN: $elem.eq(4).text(),
				// 		credit: $elem.eq(5).text(),
				// 		score: $elem.eq(6).text(),
				// 		score1: $elem.eq(7).text(),
				// 		score2: $elem.eq(8).text()
				// 	})
				// });
				//items.shift();
				resolve(items);
			});
	});
}

exports.getLib = function * (next) {
	var sid = this.request.query.sid;
	if (!sid) {
		return this.body = send(400, '缺少参数');
	}

	var items = yield getLibInfo(sid);
	if (items)
		this.body = send(1, 'success', items);
	else this.body = send(404, 'error', items);
}

function getLibInfo(sid) {
	return new Promise(function(resolve, reject) {
		superagent
			.post('http://portal.ecjtu.edu.cn/dcp/jy/jyH5Mobile.action')
			.send({
				"map": {
					"method": "getBookInfo",
					"params": {
						"javaClass": "java.util.ArrayList",
						"list": [sid, 1, 5]
					}
				},
				"javaClass": "java.util.HashMap"
			})
			.set({
				'User-Agent': 'User-Agent: Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/44.0.2403.90 Mobile Safari/537.36',
				'render': 'json',
				'clientType': 'json'
			})
			.end(function(err, res) {
				var data = JSON.parse(res.text).list;
				var items = [];
				for (var i in data) {
					var x = data[i].map;
					x.GHRQ = x.GHRQ.time;
					x.DQRQ = x.DQRQ.time;
					x.JYRQ = x.JYRQ.time;
					delete x.JYR;
					items.push(x);
				}
				resolve(items);
			});
	});
}