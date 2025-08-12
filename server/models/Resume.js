const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdfBuffer: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true,
    default: 'application/pdf'
  },
  originalName: {
    type: String,
    required: true
  },
  parsedText: {
    type: String,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
resumeSchema.index({ userId: 1 });
resumeSchema.index({ skills: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
