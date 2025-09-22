const express = require('express');
const User = require('../models/User');
const SelectedJobs = require('../models/SelectedJobs');
const EmailLog = require('../models/EmailLog');
const authMiddleware = require('../middleware/authMiddleware');
const premiumMiddleware = require('../middleware/premiumMiddleware');
const { sendSelectedJobsEmail } = require('../utils/mailer');

const router = express.Router();

// @route   POST /api/email/sendSelectedJobs
// @desc    Send selected jobs to user's email (Premium only)
// @access  Private + Premium
router.post('/sendSelectedJobs', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    const { selectedJobs } = req.body;

    if (!selectedJobs || !Array.isArray(selectedJobs) || selectedJobs.length === 0) {
      return res.status(400).json({ message: 'Please provide selected jobs to send' });
    }

    // Get user details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate job data
    const validJobs = selectedJobs.filter(job => 
      job.apiJobId && job.title && job.company && job.url
    );

    if (validJobs.length === 0) {
      return res.status(400).json({ message: 'No valid jobs provided' });
    }

    // Send email
    const emailResult = await sendSelectedJobsEmail({
      to: user.email,
      jobs: validJobs,
      userName: user.name,
      userId: req.user.id
    });

    // Save selected jobs record
    const selectedJobsRecord = new SelectedJobs({
      userId: req.user.id,
      jobs: validJobs,
      sentToEmail: true
    });
    await selectedJobsRecord.save();

    // Log email
    const emailLog = new EmailLog({
      userId: req.user.id,
      recipientEmail: user.email,
      jobCount: validJobs.length,
      subject: `🎯 ${validJobs.length} Job Recommendations from JobSnap`
    });
    await emailLog.save();

    res.json({
      message: `Successfully sent ${validJobs.length} jobs to ${user.email}`,
      emailId: emailResult.messageId,
      jobCount: validJobs.length,
      sentTo: user.email
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ 
      message: 'Failed to send email', 
      error: error.message 
    });
  }
});

// @route   GET /api/email/history
// @desc    Get user's email history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const emailLogs = await EmailLog.find({ userId: req.user.id })
      .sort({ sentAt: -1 })
      .limit(50);

    const selectedJobsHistory = await SelectedJobs.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      emailLogs,
      selectedJobsHistory,
      totalEmails: emailLogs.length
    });
  } catch (error) {
    console.error('Email history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/email/stats
// @desc    Get email statistics for admin
// @access  Private
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin (simple check for demo)
    const user = await User.findById(req.user.id);
    if (user.email !== 'admin@example.com') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const totalEmails = await EmailLog.countDocuments();
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const totalSelectedJobs = await SelectedJobs.countDocuments();

    // Get recent email activity
    const recentEmails = await EmailLog.find()
      .populate('userId', 'name email')
      .sort({ sentAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalEmails,
        totalUsers,
        premiumUsers,
        totalSelectedJobs
      },
      recentEmails
    });
  } catch (error) {
    console.error('Email stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
