var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  applicantEmail: {type: String, required: true, trim: true},
  hostEmail: {type: String, required: true, trim: true},
  title:{type: String, required: true},
  fee:{type: Number, default: 0},
  address: {type: String, required: true},
  reservationStatus:{type: String, required: true},
  checkinDate:{type: Date},
  checkoutDate:{type: Date},
  capacity:{type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Book = mongoose.model('air-Book', schema);

module.exports = Book;
