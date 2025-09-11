const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/premium/upgrade
// @desc    Upgrade user to premium (demo implementation)
// @access  Private
router.post('/upgrade', authMiddleware, async (req, res) => {
  try {
    const { plan = 'monthly' } = req.body;
    
    // Demo implementation - in production, integrate with Stripe/Razorpay
    let expirationDate;
    
    switch (plan) {
      case 'monthly':
        expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        break;
      case 'yearly':
        expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days
        break;
      default:
        expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to monthly
    }

    // Update user premium status
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        isPremium: true,
        premiumExpiresAt: expirationDate
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Successfully upgraded to premium!',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        premiumExpiresAt: updatedUser.premiumExpiresAt
      },
      plan: plan,
      expiresAt: expirationDate
    });
  } catch (error) {
    console.error('Premium upgrade error:', error);
    res.status(500).json({ message: 'Server error during premium upgrade' });
  }
});

// @route   GET /api/premium/status
// @desc    Get user's premium status
// @access  Private
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const isExpired = user.premiumExpiresAt && now > user.premiumExpiresAt;
    
    // If premium has expired, update the user
    if (isExpired && user.isPremium) {
      await User.findByIdAndUpdate(req.user.id, { isPremium: false });
    }

    res.json({
      isPremium: user.isPremium && !isExpired,
      premiumExpiresAt: user.premiumExpiresAt,
      isExpired: isExpired,
      daysRemaining: user.premiumExpiresAt ? 
        Math.max(0, Math.ceil((user.premiumExpiresAt - now) / (1000 * 60 * 60 * 24))) : 0
    });
  } catch (error) {
    console.error('Premium status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/premium/cancel
// @desc    Cancel premium subscription (demo)
// @access  Private
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        isPremium: false,
        premiumExpiresAt: null
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Premium subscription cancelled successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPremium: updatedUser.isPremium,
        premiumExpiresAt: updatedUser.premiumExpiresAt
      }
    });
  } catch (error) {
    console.error('Premium cancellation error:', error);
    res.status(500).json({ message: 'Server error during cancellation' });
  }
});

module.exports = router;
