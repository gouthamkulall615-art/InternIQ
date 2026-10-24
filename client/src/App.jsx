import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FileSearch, FileSignature, Map, Target, BrainCircuit, Sun, Moon, Menu, X, LogOut, ChevronDown, FileDown } from 'lucide-react';
import InstallPrompt from './components/InstallPrompt';
import UpdatePrompt from './components/UpdatePrompt';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './modules/resume-analyzer/ResumeAnalyzer';
import SkillGapAnalyzer from './modules/skill-gap-analyzer/SkillGapAnalyzer';
import CoverLetterGenerator from './modules/cover-letter/CoverLetterGenerator';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import AsciiBackground from './components/AsciiBackground';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
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

  // Derive display values from active user
  const activeUser = user;
  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar || null;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', href: '/resume-analyzer', icon: FileSearch },
    { name: 'Skill Gap', href: '/skill-gap', icon: BrainCircuit },
    { name: 'Cover Letters', href: '/cover-letter', icon: FileSignature },
    { name: 'Roadmap Provider', href: 'https://path-forge-amber.vercel.app/', icon: Map, external: true },
    { name: 'App Tracker', href: '#', icon: Target, disabled: true },
  ];

  // Don't show app navbar on landing page (root / or /landing) or auth pages
  if (
    ['/', '/landing', '/login', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/auth/')
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/85 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side: hamburger + logo */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo */}
            <Link
              to="/dashboard"
              className="flex-shrink-0 group flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg px-1 py-0.5"
            >
              <h1 className="text-xl font-bold text-[var(--text)] tracking-tight">
                Intern<span className="text-[var(--primary)]">IQ</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = !item.external && location.pathname === item.href;
              const classes = `px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-150 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                isActive
                  ? 'text-[var(--primary)] bg-[var(--primary-soft)] font-semibold shadow-xs'
                  : item.disabled
                    ? 'text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]'
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
                    <span className="ml-1.5 text-[9px] uppercase font-bold bg-[var(--surface-muted)] text-[var(--text-muted)] py-0.5 px-1.5 rounded-full align-middle border border-[var(--border)]">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Download Resume Template (Outline Style) */}
            <a
              href="/ats-resume-template.pdf"
              download
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface-muted)] transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              <FileDown className="h-4 w-4" />
              Template
            </a>

            {/* Install App (PWA) */}
            <InstallPrompt />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User menu (desktop) */}
            {isAuthenticated && activeUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-xs">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 py-1.5 backdrop-blur-md">
                      <div className="px-4 py-2 border-b border-[var(--border)]">
                        <p className="text-sm font-semibold text-[var(--text)] truncate">{displayName}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{displayEmail}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
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
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-[var(--surface)]/95 backdrop-blur-xl border-r border-[var(--border)] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--text)] tracking-tight">
              Intern<span className="text-[var(--primary)]">IQ</span>
            </h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
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
              const classes = `flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-colors min-h-[44px] ${
                isActive
                  ? 'text-[var(--primary)] bg-[var(--primary-soft)] font-semibold'
                  : item.disabled
                    ? 'text-[var(--text-muted)] opacity-50 cursor-not-allowed'
                    : 'text-[var(--text)] hover:bg-[var(--surface-muted)]'
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
                  <span className="flex-1">{item.name}</span>
                  {item.disabled && (
                    <span className="text-[9px] uppercase font-bold bg-[var(--surface-muted)] text-[var(--text-muted)] py-0.5 px-1.5 rounded-full border border-[var(--border)]">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section (bottom) */}
          <div className="px-4 py-4 border-t border-[var(--border)]">
            {isAuthenticated && activeUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-xs">
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{displayName}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{displayEmail}</p>
                  </div>
                </div>
                <a
                  href="/ats-resume-template.pdf"
                  download
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface-muted)] transition-colors min-h-[44px]"
                >
                  <FileDown className="h-4 w-4" />
                  Download Resume Template
                </a>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors min-h-[44px]"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <a
                  href="/ats-resume-template.pdf"
                  download
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded-lg hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--surface-muted)] transition-colors min-h-[44px]"
                >
                  <FileDown className="h-4 w-4" />
                  Download Resume Template
                </a>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-muted)] transition-colors min-h-[44px]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors min-h-[44px] shadow-xs"
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
  const location = useLocation();
  const showAsciiBackground = ['/', '/landing', '/login', '/register'].includes(location.pathname);

  return (
    <div className="relative min-h-screen text-[var(--text)] transition-colors duration-200">
      {showAsciiBackground && <AsciiBackground />}
      <Navbar />
      <UpdatePrompt />
      <div className="relative z-10">
        <Routes>
          {/* Landing page at root / and explicit /landing */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Direct dashboard route */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Protected routes */}
          <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><SkillGapAnalyzer /></ProtectedRoute>} />
          <Route path="/cover-letter" element={<ProtectedRoute><CoverLetterGenerator /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
