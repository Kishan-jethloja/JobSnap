const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdf: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    default: 'application/pdf'
  },
  parsedText: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    lowercase: true
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
