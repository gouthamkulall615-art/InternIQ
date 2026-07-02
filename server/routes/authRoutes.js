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
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// Google OAuth callback — issues JWT and redirects to frontend
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to frontend with token as query param — frontend will extract and store it
    const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientURL}/auth/callback?token=${token}`);
  }
);

export default router;
