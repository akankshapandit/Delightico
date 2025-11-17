import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    console.log('🟡 Auth Middleware - Headers:', req.headers);
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('🟡 Token extracted:', token ? 'Yes' : 'No');
    } else {
      console.log('🟡 No Bearer token found in headers');
    }

    if (!token) {
      console.log('🔴 No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - No token'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🟡 Token decoded successfully, user ID:', decoded.id);
      
      const user = await User.findById(decoded.id);
      if (!user) {
        console.log('🔴 User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      req.user = user;
      console.log('🟢 User authenticated:', user.email);
      next();
    } catch (error) {
      console.log('🔴 Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - Invalid token'
      });
    }
  } catch (error) {
    console.error('🔴 Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in authentication'
    });
  }
};

// ADD THIS authorize FUNCTION - it was missing
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no user found'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Alternative simpler version if you don't need role-based auth:
// export const authorize = (...roles) => (req, res, next) => {
//   if (!roles.includes(req.user?.role)) {
//     return res.status(403).json({
//       success: false,
//       message: 'Not authorized for this action'
//     });
//   }
//   next();
// };