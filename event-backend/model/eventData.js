
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  location: String,
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    validate: {
      validator: function (value) {
        return !this.isPaid || (value > 0);
      },
      message: 'Paid events must have a price greater than 0'
    }
  },
  

  image:String,
  isPaid: {
    type: Boolean,
    default: false
  },
  availableSeats: {
    type: Number,
    required: true
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  calendarEventId: String,
  assignedController:{
    type:Types.ObjectId,
    ref:'User',
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
});

module.exports = mongoose.model('Event', eventSchema);
