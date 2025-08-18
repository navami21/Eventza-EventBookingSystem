const jwt = require('jsonwebtoken');
const User=require('../model/userData')


// Middleware to protect routes (requires valid JWT)
const protect = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user document from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Full user object now available
    console.log('Authenticated user:', req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// Middleware to restrict access to admin users
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
// Middleware to restrict access to controller users
const controllerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'controller') {
    return res.status(403).json({ message: 'Controller access required' });
  }
  next();
};

module.exports = { protect, adminOnly,controllerOnly };

