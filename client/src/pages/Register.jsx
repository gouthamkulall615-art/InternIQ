import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import FlyingButton from '../components/FlyingButton';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function Register() {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-colors min-h-[44px]";

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12 transition-colors">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Intern<span className="text-[#0A66C2]">IQ</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Create your free account</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)]/75 backdrop-blur-md rounded-2xl border border-[var(--border)]/70 shadow-xl p-8">
          {/* Google Button */}
          <button
            onClick={googleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors min-h-[44px]"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--surface)] px-3 text-gray-400 dark:text-gray-500 uppercase tracking-wider rounded">or</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="register-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className={inputClass} placeholder="John Doe" autoComplete="name" />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className={inputClass} placeholder="you@example.com" autoComplete="email" />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="register-password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-colors min-h-[44px]"
                  placeholder="Min. 6 characters" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input id="register-confirm" type={showPassword ? 'text' : 'password'} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass} placeholder="Re-enter password" autoComplete="new-password" />
              </div>
            </div>

            <div className="relative w-full h-[230px] rounded-xl overflow-hidden bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
              <FlyingButton
                theme={theme === 'dark' ? 'dark' : 'light'}
                size="medium"
                altitude={110}
                hoverTime={2.4}
                jets={2}
                thrusters
                trigger="hover"
                carryCursor
                smoke={1}
                turbulence={1}
                wobble={1}
                ramp={false}
                thrustColor={theme === 'dark' ? '#818CF8' : '#0A66C2'}
                smokeColor={theme === 'dark' ? '#334155' : '#CBD5E1'}
                buttonColor="#0A66C2"
                textColor="#FFFFFF"
                onClick={handleSubmit}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </FlyingButton>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[#0A66C2] hover:text-[#004182] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
