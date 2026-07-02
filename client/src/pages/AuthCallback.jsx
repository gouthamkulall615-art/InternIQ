import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * This page handles the redirect back from Google OAuth.
 * The backend redirects here with ?token=... in the URL.
 * We extract the token, store it, and redirect to the dashboard.
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Force a full reload so AuthContext picks up the new token
      window.location.href = '/';
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#0A66C2] animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Completing sign in…</p>
      </div>
    </div>
  );
}
