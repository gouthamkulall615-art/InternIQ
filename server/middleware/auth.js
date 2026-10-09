import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// STUB: Third-party OAuth token verification
const verifyOAuthToken = async (_token) => {
  throw new Error('TODO: replace with MongoDB/Google auth');
};

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  // ── Strategy 1: Try custom JWT first ────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = await User.findById(decoded.id).select('-password');
    return next();
  } catch (_jwtError) {
    // Custom JWT failed — fall through to third-party OAuth verification
  }

  // ── Strategy 2: Fallback OAuth token verification ───────────────────
  try {
    await verifyOAuthToken(token);
    return next();
  } catch (_authError) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
