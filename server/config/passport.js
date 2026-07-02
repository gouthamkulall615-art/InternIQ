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
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // ⬇️ CONFIGURE YOUR REDIRECT URI HERE — must match Google Cloud Console
        callbackURL: '/api/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Check if user already exists by googleId
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          }

          // Check if a user with same email exists (registered via email/password)
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google account to existing email user
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value || '';
            await user.save();
            return done(null, user);
          }

          // Create a new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || '',
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
