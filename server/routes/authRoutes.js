import express from 'express';
import passport from 'passport';
import { registerUser, authUser, getMe, getUserProfile, logoutUser, generateToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Email/password auth
router.post('/register', registerUser);
router.post('/login', authUser);

// Session restore & user info
router.get('/me', protect, getMe);
router.get('/profile', protect, getUserProfile); // backward compat

// Logout (stateless — frontend clears token)
router.post('/logout', logoutUser);

// Google OAuth
// Initiates the Google OAuth consent screen
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ message: 'Google OAuth credentials not configured on server' });
  }

  // Determine frontend client origin (from query param, Referer header, or env)
  let origin = req.query.origin;
  if (!origin && req.headers.referer) {
    try {
      origin = new URL(req.headers.referer).origin;
    } catch {}
  }
  if (!origin) {
    origin = process.env.CLIENT_URL || 'http://localhost:5173';
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account',
    state: origin,
  })(req, res, next);
});

// Google OAuth callback — issues JWT and redirects to frontend
router.get('/google/callback', (req, res, next) => {
  // Extract origin from OAuth state param, falling back to CLIENT_URL
  let clientURL = req.query.state;
  if (clientURL) {
    try {
      const parsed = new URL(clientURL);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        clientURL = null;
      }
    } catch {
      clientURL = null;
    }
  }

  if (!clientURL) {
    clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
  }
  clientURL = clientURL.replace(/\/+$/, '');

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('Google OAuth callback error:', err || info);
      const errorMsg = err?.message || info?.message || 'Authentication with Google failed';
      return res.redirect(`${clientURL}/login?error=${encodeURIComponent(errorMsg)}`);
    }

    const token = generateToken(user._id);
    return res.redirect(`${clientURL}/auth/callback?token=${token}`);
  })(req, res, next);
});

export default router;
