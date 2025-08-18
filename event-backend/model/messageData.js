const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const messageSchema = new Schema({
  sender: { type: Types.ObjectId, ref: 'User' },
  receiver: { type: Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
email: { type: String },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  replyTo: { type:Types.ObjectId, ref: 'Message' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
