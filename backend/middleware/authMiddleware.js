const jwt = require('jsonwebtoken');

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization');

  // If no token is provided, deny access
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token using a secret key (replace 'your_jwt_secret' with your actual secret key)
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Make sure to use a strong secret key in production
    
    // Attach the decoded information to the request object so it can be accessed by the next middleware or route handler
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    // If the token is invalid or expired, deny access
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Export the middleware to be used in other files
module.exports = { verifyToken };
