import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

/**
 * Google OAuth 2.0 Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.cloud.google.com/apis/credentials
 * 2. Create a new OAuth 2.0 Client ID (Web application)
 * 3. Add authorized redirect URI: http://localhost:5000/api/auth/google/callback
 *    (For production, replace with your actual domain)
 * 4. Copy Client ID and Client Secret into your .env file:
 *    GOOGLE_CLIENT_ID=your_client_id_here
 *    GOOGLE_CLIENT_SECRET=your_client_secret_here
 */

const configurePassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️ Google OAuth credentials missing in environment variables. Google login is disabled.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        proxy: true,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value ? profile.emails[0].value.toLowerCase().trim() : null;
          const googleId = profile.id;
          const avatar = profile.photos?.[0]?.value || '';

          // 1. Check if user already exists by googleId
          let user = await User.findOne({ googleId });

          if (user) {
            return done(null, user);
          }

          // 2. Check if a user with same email exists (registered via email/password)
          if (email) {
            user = await User.findOne({ email });
          }

          if (user) {
            // Link Google account to existing email user
            user.googleId = googleId;
            if (!user.avatar && avatar) {
              user.avatar = avatar;
            }
            await user.save();
            return done(null, user);
          }

          // 3. Create a new user
          user = await User.create({
            name: profile.displayName || profile.name?.givenName || 'Google User',
            email: email || `${googleId}@google.user`,
            googleId: googleId,
            avatar: avatar,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize/deserialize (not used for JWT flow, but passport requires them)
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;
