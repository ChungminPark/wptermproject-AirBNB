var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, trim: true},
  title:{type: String, unique: true, required: true},
  content:{type: String, required: true},
  content2:{type: String, required: true},
  city:{type: String, required: true},
  address: {type: String, required: true},
  address2: {type: String, required: true},
  postcode: {type: String, required: true},
  roomtype:{type: String, required: true},
  fee:{type: Number, default: 0},
  capacity:{type: Number, default: 0},
  reservationStatus:{type: String, required: true},
  read:{type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Room = mongoose.model('air-Room', schema);

module.exports = Room;
