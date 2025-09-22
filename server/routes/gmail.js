const express = require('express');
const router = express.Router();
const gmailService = require('../utils/gmailService');
const GmailAuth = require('../models/GmailAuth');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const premiumMiddleware = require('../middleware/premiumMiddleware');

// Get Gmail OAuth URL
router.get('/auth-url', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    console.log('🔗 Generating Gmail auth URL for user:', req.user.email);
    const authUrl = gmailService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('❌ Error generating Gmail auth URL:', error);
    res.status(500).json({ message: error.message || 'Failed to generate authentication URL' });
  }
});

// Handle OAuth callback and store tokens
router.post('/auth-callback', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    console.log('📥 Handling Gmail OAuth callback for user:', req.user.email);
    const { code } = req.body;
    
    if (!code) {
      console.log('❌ No authorization code provided');
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    console.log('🔄 Exchanging code for tokens...');
    // Exchange code for tokens
    const tokens = await gmailService.getTokens(code);
    
    // Set credentials to get user profile
    gmailService.setCredentials(tokens);
    console.log('👤 Getting user Gmail profile...');
    const profile = await gmailService.getUserProfile();

    console.log('💾 Saving Gmail auth to database...');
    // Save or update Gmail auth in database
    const gmailAuth = await GmailAuth.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type || 'Bearer',
        expiryDate: new Date(tokens.expiry_date),
        scope: tokens.scope,
        gmailEmail: profile.emailAddress,
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('✅ Gmail authentication successful for:', profile.emailAddress);
    res.json({ 
      message: 'Gmail authentication successful',
      gmailEmail: profile.emailAddress,
      isConnected: true
    });
  } catch (error) {
    console.error('❌ Error handling Gmail auth callback:', error);
    res.status(500).json({ message: `Failed to authenticate with Gmail: ${error.message}` });
  }
});

// Check Gmail connection status
router.get('/status', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    const gmailAuth = await GmailAuth.findOne({ userId: req.user.id, isActive: true });
    
    if (!gmailAuth) {
      return res.json({ isConnected: false });
    }

    // Check if token is expired
    if (gmailAuth.isTokenExpired()) {
      return res.json({ 
        isConnected: false, 
        message: 'Gmail authentication expired. Please reconnect.' 
      });
    }

    res.json({
      isConnected: true,
      gmailEmail: gmailAuth.gmailEmail,
      connectedAt: gmailAuth.createdAt
    });
  } catch (error) {
    console.error('Error checking Gmail status:', error);
    res.status(500).json({ message: 'Failed to check Gmail status' });
  }
});

// Create Gmail drafts for selected jobs
router.post('/create-drafts', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    const { jobs } = req.body;
    
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({ message: 'Jobs array is required' });
    }

    // Get Gmail auth
    const gmailAuth = await GmailAuth.findOne({ userId: req.user.id, isActive: true });
    
    if (!gmailAuth) {
      return res.status(400).json({ 
        message: 'Gmail not connected. Please connect your Gmail account first.' 
      });
    }

    // Check if token is expired
    if (gmailAuth.isTokenExpired()) {
      return res.status(400).json({ 
        message: 'Gmail authentication expired. Please reconnect your Gmail account.' 
      });
    }

    // Set credentials
    gmailService.setCredentials(gmailAuth.getTokenData());

    // Get user details from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create user profile for email generation
    const userProfile = {
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    };

    // Create drafts
    const results = await gmailService.createJobApplicationDrafts(
      jobs, 
      userProfile, 
      gmailAuth.gmailEmail
    );

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.json({
      message: `Successfully created ${successCount} Gmail drafts${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      results,
      successCount,
      failureCount,
      gmailEmail: gmailAuth.gmailEmail
    });
  } catch (error) {
    console.error('Error creating Gmail drafts:', error);
    res.status(500).json({ message: 'Failed to create Gmail drafts' });
  }
});

// Get Gmail drafts
router.get('/drafts', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    // Get Gmail auth
    const gmailAuth = await GmailAuth.findOne({ userId: req.user.id, isActive: true });
    
    if (!gmailAuth) {
      return res.status(400).json({ 
        message: 'Gmail not connected. Please connect your Gmail account first.' 
      });
    }

    // Check if token is expired
    if (gmailAuth.isTokenExpired()) {
      return res.status(400).json({ 
        message: 'Gmail authentication expired. Please reconnect your Gmail account.' 
      });
    }

    // Set credentials
    gmailService.setCredentials(gmailAuth.getTokenData());

    // Get drafts
    const drafts = await gmailService.listDrafts();

    res.json({
      drafts,
      count: drafts.length,
      gmailEmail: gmailAuth.gmailEmail
    });
  } catch (error) {
    console.error('Error fetching Gmail drafts:', error);
    res.status(500).json({ message: 'Failed to fetch Gmail drafts' });
  }
});

// Disconnect Gmail
router.delete('/disconnect', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    await GmailAuth.findOneAndUpdate(
      { userId: req.user.id },
      { isActive: false }
    );

    res.json({ message: 'Gmail disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    res.status(500).json({ message: 'Failed to disconnect Gmail' });
  }
});

module.exports = router;
