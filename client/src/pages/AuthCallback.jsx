import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

/**
 * This page handles the redirect back from Google OAuth via Supabase.
 * Supabase automatically parses the session from the URL — we just
 * need to wait for it, then redirect to the dashboard.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth callback error:', error.message);
        navigate('/login');
        return;
      }
      if (data.session) {
        navigate('/');
      } else {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#0A66C2] animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Completing sign in…</p>
      </div>
    </div>
  );
}