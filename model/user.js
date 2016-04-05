var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	_id: {type: String},    //email
	stuid: {type: String, ref: 'Stu'},
	//ban: {type: Boolean, default: false},
	pwd: {type: String},
	//nickname: {type: String},
	//phone: {type: String},
	//ecard: {type: String},
	//epwd: {type: String},
	//sex: {type: Number},
	//rdate: {type: Date, default: Date.now}
});

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret, options) {
	delete ret.__v;
    delete ret.pwd;
	delete ret.rdate;
}


UserSchema.index({_id: 1}, {unique: true});

mongoose.model('User', UserSchema);