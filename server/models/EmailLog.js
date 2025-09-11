const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  jobCount: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
