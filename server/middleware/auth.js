import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import User from '../models/User.js';

// Initialize Supabase admin client (service role key for backend token verification)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    // Custom JWT failed — fall through to Supabase verification
  }

  // ── Strategy 2: Try Supabase access token ───────────────────────────
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    // Attach Supabase user info in a shape the rest of the app can use
    req.user = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      avatar: user.user_metadata?.avatar_url || null,
      provider: 'supabase',
    };

    return next();
  } catch (supabaseError) {
    console.error('Supabase auth verification error:', supabaseError);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export { protect };
