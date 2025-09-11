const mongoose = require('mongoose');

const selectedJobsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobs: [{
    apiJobId: {
      type: String,
      required: true
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
    }
  }],
  sentToEmail: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SelectedJobs', selectedJobsSchema);
