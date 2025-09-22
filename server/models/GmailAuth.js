const mongoose = require('mongoose');

const gmailAuthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  tokenType: {
    type: String,
    default: 'Bearer'
  },
  expiryDate: {
    type: Date,
    required: true
  },
  scope: {
    type: String,
    required: true
  },
  gmailEmail: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
gmailAuthSchema.index({ userId: 1 });
gmailAuthSchema.index({ gmailEmail: 1 });

// Method to check if token is expired
gmailAuthSchema.methods.isTokenExpired = function() {
  return new Date() >= this.expiryDate;
};

// Method to get token data for OAuth client
gmailAuthSchema.methods.getTokenData = function() {
  return {
    access_token: this.accessToken,
    refresh_token: this.refreshToken,
    token_type: this.tokenType,
    expiry_date: this.expiryDate.getTime()
  };
};

module.exports = mongoose.model('GmailAuth', gmailAuthSchema);
