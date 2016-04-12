var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var CourseSchema = new Schema({
	name: {type: String},
	teacher: {type: String},
	room: {type: String},
	row: {type: Number},
	column: {type: Number},
	row_span: {type: Number},
	enable: [{type: Number}],
	flag: {type: Number}
});

var ClazzSchema = new Schema({
	_id: {type: String},
	name: {type: String},
	depart: {type: String},
	course: {type: Schema.Types.Mixed, default: null}
});

if (!CourseSchema.options.toObject) CourseSchema.options.toObject = {};
CourseSchema.options.toObject.transform = function (doc, ret, options) {
	delete ret._id;
}
if (!ClazzSchema.options.toObject) ClazzSchema.options.toObject = {};
ClazzSchema.options.toObject.transform = function (doc, ret, options) {
	delete ret.__v;
}



ClazzSchema.index({_id: 1}, {unique: true});

mongoose.model('Course', CourseSchema);
mongoose.model('Clazz', ClazzSchema);