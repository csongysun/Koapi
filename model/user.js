var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	_id: {type: String, index: true},    //email
	stuid: {type: String, ref: 'Stu'},
	pwd: {type: String},
	epwd: {type: String}
});

if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret, options) {
	delete ret.__v;
    delete ret.pwd;
	delete ret.rdate;
}


//UserSchema.index({_id: 1}, {unique: true});

mongoose.model('User', UserSchema);