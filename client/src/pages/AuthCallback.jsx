import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get('token');
    const authError = searchParams.get('error');

    if (authError) {
      navigate(`/login?error=${encodeURIComponent(authError)}`, { replace: true });
      return;
    }

    if (!token) {
      navigate('/login?error=Authentication%20failed.%20No%20token%20received.', { replace: true });
      return;
    }

    loginWithToken(token)
      .then(() => {
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        console.error('Failed to authenticate with token:', err);
        setError(err.response?.data?.message || err.message || 'Authentication failed');
        setTimeout(() => {
          navigate('/login?error=Session%20creation%20failed', { replace: true });
        }, 1500);
      });
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
      <div className="text-center px-4">
        {error ? (
          <div className="flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            <p className="text-xs text-gray-500 mt-1">Redirecting to sign in…</p>
          </div>
        ) : (
          <>
            <Loader2 className="w-8 h-8 text-[#0A66C2] animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Completing sign in…</p>
          </>
        )}
      </div>
    </div>
  );
}