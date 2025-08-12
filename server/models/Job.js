const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobIdFromAPI: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date
  },
  cachedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
jobSchema.index({ jobIdFromAPI: 1 });
jobSchema.index({ tags: 1 });
jobSchema.index({ cachedAt: 1 });
jobSchema.index({ title: 'text', description: 'text', company: 'text' });

// Method to check if job is fresh (less than 24 hours old)
jobSchema.methods.isFresh = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.cachedAt > twentyFourHoursAgo;
};

module.exports = mongoose.model('Job', jobSchema);
