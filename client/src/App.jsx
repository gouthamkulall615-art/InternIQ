import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileSearch, FileSignature, Map, Target, BrainCircuit, Sun, Moon, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './modules/resume-analyzer/ResumeAnalyzer';
import SkillGapAnalyzer from './modules/skill-gap-analyzer/SkillGapAnalyzer';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, supabaseUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [mobileMenuOpen]);

  // Derive display values from whichever auth method is active
  const activeUser = user || supabaseUser;
  const displayName = user?.name || supabaseUser?.user_metadata?.full_name || 'User';
  const displayEmail = user?.email || supabaseUser?.email || '';
  const displayAvatar = user?.avatar || supabaseUser?.user_metadata?.avatar_url || null;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Resume Analyzer', href: '/resume-analyzer', icon: FileSearch },
    { name: 'Skill Gap', href: '/skill-gap', icon: BrainCircuit },
    { name: 'Cover Letters', href: '#', icon: FileSignature, disabled: true },
    { name: 'Roadmap Provider', href: 'https://path-forge-amber.vercel.app/', icon: Map, external: true },
    { name: 'App Tracker', href: '#', icon: Target, disabled: true },
  ];

  // Don't show navbar on auth pages
  if (['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/auth/')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: hamburger + logo */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button (left side for natural left-drawer UX) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Intern<span className="text-[#0A66C2]">IQ</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = !item.external && location.pathname === item.href;
              const classes = `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'text-[#0A66C2] bg-blue-50 dark:bg-[#0A66C2]/10'
                  : item.disabled
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`;

              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes}
                  >
                    {item.name}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.disabled ? '#' : item.href}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  className={classes}
                >
                  {item.name}
                  {item.disabled && (
                    <span className="ml-1.5 text-[9px] uppercase font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 py-0.5 px-1.5 rounded-full align-middle">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User menu (desktop) */}
            {isAuthenticated && activeUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50 py-1">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer — glassmorphism slide-in from left */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200/50 dark:border-gray-800/50">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Intern<span className="text-[#0A66C2]">IQ</span>
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = !item.external && location.pathname === item.href;
              const Icon = item.icon;
              const classes = `flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                isActive
                  ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                  : item.disabled
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60'
              }`;

              if (item.external) {
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className={classes}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </a>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.disabled ? '#' : item.href}
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault();
                    else setMobileMenuOpen(false);
                  }}
                  className={classes}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                  {item.disabled && (
                    <span className="text-[9px] uppercase font-bold bg-gray-100/80 dark:bg-gray-800/80 text-gray-400 py-0.5 px-1.5 rounded-full">Soon</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section (bottom) */}
          <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-800/50">
            {isAuthenticated && activeUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{displayEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/20 rounded-lg transition-colors min-h-[44px]"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300/60 dark:border-gray-700/60 rounded-lg hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors min-h-[44px]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors min-h-[44px]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGapAnalyzer /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
