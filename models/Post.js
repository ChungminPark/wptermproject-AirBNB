var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, index: true, trim: true},
  password: {type: String},
  title: {type: String, required: true, trim: true},
  description: {type: String, required: true, trim: true},
  city: {type: String, required: true, trim: true},
  fee: {type: String, required: true, trim: true},
  facility: {type: String, required: true, trim: true},
  rule: {type: String, required: true, trim: true},
  read: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('air-Post', schema);

module.exports = Post;
