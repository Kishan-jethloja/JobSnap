const premiumMiddleware = (req, res, next) => {
  try {
    // Check if user is authenticated (should be called after authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has premium access
    if (!req.user.isPremium) {
      return res.status(403).json({ 
        message: 'Premium subscription required',
        code: 'PREMIUM_REQUIRED'
      });
    }

    // Check if premium subscription has expired
    if (req.user.premiumExpiresAt && new Date() > new Date(req.user.premiumExpiresAt)) {
      return res.status(403).json({ 
        message: 'Premium subscription has expired',
        code: 'PREMIUM_EXPIRED'
      });
    }

    next();
  } catch (error) {
    console.error('Premium middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = premiumMiddleware;
