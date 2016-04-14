//var Data = require('../data/data.js');
var MapItem = require('../model/index.js').MapItem;

function send(status, msg, content) {
	return {
		status: status,
		msg: msg,
		content: content
	}
}

exports.getMap = function * (next){
    
    var items = yield MapItem.find({}).exec();
    
    this.body = items;
}

