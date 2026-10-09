import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// STUB: OAuth callback session processing
const handleOAuthCallback = () => {
  throw new Error('TODO: replace with MongoDB/Google auth');
};

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      handleOAuthCallback();
    } catch (err) {
      console.warn(err.message);
      navigate('/login');
    }
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