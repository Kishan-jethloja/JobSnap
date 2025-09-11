const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (authHeader) {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Add user to request
    req.user = {
      id: user._id,
      email: user.email,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
