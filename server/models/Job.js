const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  apiJobId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  applicationUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  location: {
    type: String,
    default: ''
  },
  salary: {
    type: String,
    default: ''
  },
  jobType: {
    type: String,
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    default: 'Mid-level'
  },
  publication_date: {
    type: Date
  },
  cachedAt: {
    type: Date,
    default: Date.now
  },
  isPremiumJob: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Job', jobSchema);
