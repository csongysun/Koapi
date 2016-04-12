var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var StuSchema = new Schema({
	_id: {type: String},
	name: {type: String},
	clazz: {type: String, ref: 'Clazz' },
	state: {type: String},
	//course_box: [CourseSchema]
});


if (!StuSchema.options.toObject) StuSchema.options.toObject = {};
StuSchema.options.toObject.transform = function (doc, ret, options) {
	delete ret.__v;
}


StuSchema.index({_id: 1}, {unique: true});
mongoose.model('Stu', StuSchema);
