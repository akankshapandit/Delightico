import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    let token;

    console.log('🔐 Auth middleware called');
    console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token from header:', token ? `Present (length: ${token.length})` : 'Missing');
    }

    // Check for token in cookies
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
      console.log('Token from cookie:', token ? `Present (length: ${token.length})` : 'Missing');
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Validate token format before verification
    if (typeof token !== 'string' || !token.startsWith('eyJ') || token.split('.').length !== 3) {
      console.log('❌ Invalid token format:', token.substring(0, 50) + '...');
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    try {
      console.log('🔑 Verifying token...');
      const jwtSecret = process.env.JWT_SECRET;
      
      if (!jwtSecret) {
        console.error('❌ JWT_SECRET is not set in environment variables');
        return res.status(500).json({
          success: false,
          message: 'Server configuration error'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, jwtSecret);
      console.log('✅ Token decoded successfully:', { id: decoded.id });
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('❌ User not found for token');
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }

      req.user = user;
      console.log('✅ User authenticated:', user.email);
      next();
    } catch (error) {
      console.error('❌ Token verification error:', error.name, error.message);
      
      // More specific error messages
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
  } catch (error) {
    console.error('🔴 Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

export { protect, admin };