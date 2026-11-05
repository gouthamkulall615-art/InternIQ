import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  Check,
  CircleAlert,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Target,
  FileText,
  ArrowUpRight,
} from '@phosphor-icons/react';
import GhostType from '../components/GhostType';
import GooeyNav from '../components/GooeyNav';
import CrowdStory from '../components/CrowdStory';
import RibbonMarquee from '../components/RibbonMarquee';
import ProblemCards from '../components/ProblemCards';
import ToolsSection from '../components/ToolsSection';
import HowItWorks from '../components/HowItWorks';
import Magnet from '../components/Magnet';
import StaggeredMenu from '../components/StaggeredMenu';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Tools', href: '#tools' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Skill benchmark', href: '#skill-benchmark' },
  ];

  const handleNavChange = (index, item) => {
    isClickScrollingRef.current = true;
    setActiveNavIndex(index);
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);

    if (item.href === '#overview' || item.href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.href?.startsWith('#')) {
      const el = document.querySelector(item.href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const sectionIds = ['overview', 'tools', 'how-it-works', 'skill-benchmark'];
    let ticking = false;

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 160;

          let currentSectionIndex = 0;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el) {
              const top = el.offsetTop;
              if (scrollPosition >= top) {
                currentSectionIndex = i;
                break;
              }
            }
          }
          setActiveNavIndex(currentSectionIndex);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const roles = [
    {
      title: 'Frontend Developer',
      matched: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Git', 'REST APIs', 'Tailwind CSS', 'Responsive Design'],
      missing: ['TypeScript', 'Testing (Jest)', 'Vite / Webpack', 'Web Accessibility (a11y)'],
      readiness: 67,
    },
    {
      title: 'Backend Developer',
      matched: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git', 'Authentication (JWT)', 'API Security'],
      missing: ['Docker', 'SQL / PostgreSQL', 'Redis Caching', 'Unit Testing'],
      readiness: 64,
    },
    {
      title: 'Full Stack Developer',
      matched: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'REST APIs'],
      missing: ['TypeScript', 'SQL', 'System Design Basics', 'CI/CD Deployment'],
      readiness: 58,
    },
    {
      title: 'Data Analyst',
      matched: ['Excel', 'SQL', 'Python', 'Pandas', 'Data Visualization', 'Communication'],
      missing: ['Power BI / Tableau', 'Statistics', 'A/B Testing', 'Data Cleaning Pipeline'],
      readiness: 60,
    },
  ];

  return (
    <div className="landing font-editorial-sans antialiased min-h-screen selection:bg-[#4F46E5] selection:text-white relative bg-transparent transition-colors">
      {/* 1. TOP NAV */}
      <header className="sticky top-0 z-40 bg-[#f4f1ea]/85 dark:bg-black/40 backdrop-blur-md border-b border-[#14161F]/10 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Wordmark in Fraunces serif */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveNavIndex(0);
              }}
              className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[#0F172A] dark:text-white hover:opacity-90 transition-opacity"
            >
              InternIQ
            </Link>
          </div>

          {/* Gooey Navigation Bar (Desktop) */}
          <div className="hidden md:flex items-center justify-center">
            <GooeyNav
              items={navItems}
              activeIndex={activeNavIndex}
              onChange={(index, item) => handleNavChange(index, item)}
              theme={theme === 'dark' ? 'dark' : 'light'}
              size="sm"
              frame={true}
              particleCount={15}
              spread={56}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect={true}
              colors={theme === 'dark' ? ['#818CF8', '#6366F1', '#38BDF8'] : ['#1e3fd8', '#4f7dff', '#8fb4ff']}
            />
          </div>

          {/* Action Links */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-[4px] border border-slate-300/80 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/15 transition-colors flex items-center justify-center min-h-[40px] min-w-[40px] cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-400" strokeWidth={1.75} />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-700" strokeWidth={1.75} />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-full transition-colors min-h-[44px] shadow-lg shadow-blue-600/30"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-black dark:text-slate-200 dark:hover:text-white transition-colors min-h-[44px]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-full transition-colors min-h-[44px] shadow-lg shadow-blue-600/30"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Header Buttons (Theme Toggle + Menu) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-[4px] border border-slate-300/80 dark:border-white/15 bg-black/5 dark:bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" strokeWidth={1.5} /> : <Moon className="h-5 w-5" strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-[4px] border border-slate-300/80 dark:border-white/15 bg-black/5 dark:bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer replaced by StaggeredMenu from React Bits */}
        <StaggeredMenu
          isOpen={mobileMenuOpen}
          onMenuClose={() => setMobileMenuOpen(false)}
          position="left"
          isFixed={true}
          hideToggle={true}
          colors={['#1e3fd8', '#4F46E5', '#818CF8']}
          accentColor="#1e3fd8"
          displaySocials={true}
          displayItemNumbering={true}
          theme={theme}
          onToggleTheme={toggleTheme}
          items={navItems.map((item, idx) => ({
            label: item.label,
            link: item.href,
            active: activeNavIndex === idx,
            onClick: (e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              handleNavChange(idx, item);
            }
          }))}
          socialItems={[
            { label: 'GitHub', link: 'https://github.com' },
            { label: 'LinkedIn', link: 'https://linkedin.com' },
            { label: 'PathForge', link: 'https://github.com' }
          ]}
          authSection={
            isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-xl shadow-lg shadow-blue-600/30 transition-all min-h-[44px]"
              >
                Open Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-2.5 w-full">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white border border-slate-300/80 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-all min-h-[44px]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-xl shadow-lg shadow-blue-600/30 transition-all min-h-[44px]"
                >
                  Get started
                </Link>
              </div>
            )
          }
        />
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="scroll-mt-20 relative min-h-[560px] sm:min-h-[640px] flex items-center justify-center overflow-hidden transition-colors">
        {/* Centered Hero Content with GhostType - NO CARD */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
          <span className="font-sans text-xs uppercase tracking-widest text-indigo-700 dark:text-[#818CF8] block font-semibold mb-6 px-3.5 py-1 rounded-full bg-indigo-100/90 dark:bg-indigo-950/70 border border-indigo-300/80 dark:border-indigo-500/40 backdrop-blur-md shadow-xs">
            CAREER PREPARATION WORKSPACE
          </span>

          <div className="w-full flex justify-center text-[#0F172A] dark:text-white">
            <GhostType
              text="Fix your resume"
              completions={[
                " before they see it.",
                " before you apply.",
                " before it's rejected.",
              ]}
            />
          </div>

          <p className="font-sans text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-[1.6] max-w-2xl mt-4 font-normal">
            A straightforward ATS scanner, skill gap evaluator, and cover letter writer. Free for students and early-career job applicants.
          </p>

          {/* Action Buttons */}
          <div className="pt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5 font-sans w-full sm:w-auto">
            <Magnet
              padding={60}
              magnetStrength={2.5}
              tilt={8}
              scale={1.04}
              maxOffset={18}
            >
              <Link
                to={isAuthenticated ? "/resume-analyzer" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-sm font-medium text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/30 min-h-[44px]"
              >
                Analyze my resume
              </Link>
            </Magnet>
            <Magnet
              padding={60}
              magnetStrength={2.5}
              tilt={8}
              scale={1.04}
              maxOffset={18}
            >
              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-800 dark:text-white bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-900/15 dark:border-white/20 rounded-full backdrop-blur-md transition-all min-h-[44px] shadow-xs"
              >
                See how it works
              </a>
            </Magnet>
          </div>

          {/* Small Note */}
          <p className="font-sans text-xs text-slate-600 dark:text-slate-400 pt-3">
            Free. PDF, DOCX or TXT up to 5MB.
          </p>
        </div>
      </section>

      {/* CROWD STORY (Scroll-driven storytelling) */}
      <CrowdStory onCta={() => navigate(isAuthenticated ? '/resume-analyzer' : '/register')} />

      {/* 3D SATIN RIBBON MARQUEE */}
      <RibbonMarquee
        className="bg-[#FAF8F4] dark:bg-[#0B0D17] transition-colors"
        items={[
          "Fix your resume before they see it",
          "Beat the ATS",
          "Get shortlisted",
        ]}
      />

      {/* 3. PROBLEM CARDS */}
      <ProblemCards />

      {/* 4. THE FOUR TOOLS */}
      <ToolsSection />

      {/* 5. HOW IT WORKS (React Bits Bento with SpotlightCard, Magnet, CountUp, BlurText, ShinyText, ClickSpark) */}
      <HowItWorks />

      {/* 6. SKILL GAP BENCHMARK SECTION */}
      <section id="skill-benchmark" className="scroll-mt-20 py-16 sm:py-20 bg-[#FAF8F4] dark:bg-[#0F111A] text-[#14161F] dark:text-white transition-colors relative z-10 border-t border-[#E4E0D8] dark:border-[#262938]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Side: Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-sans font-medium text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#9CA3AF] block">
                SKILL GAP BENCHMARK
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-white leading-tight">
                Know exactly what to study before your interview.
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#5A5D6B] dark:text-[#9CA3AF] leading-[1.6]">
                Instead of guessing what hiring managers look for, compare your profile against standardized industry criteria across eight technical and product tracks. No vague advice—only clear matched competencies and missing skills.
              </p>

              {/* Interactive Role Switcher */}
              <div className="pt-2 space-y-2">
                <span className="font-sans text-xs text-[#6B7280] dark:text-[#9CA3AF] block">
                  Select a role to preview benchmarks:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r, idx) => (
                    <button
                      key={r.title}
                      type="button"
                      onClick={() => setSelectedRoleIndex(idx)}
                      className={`text-left text-xs font-sans px-3 py-2.5 rounded-[6px] border transition-colors min-h-[44px] cursor-pointer ${
                        selectedRoleIndex === idx
                          ? 'border-[#4F46E5] bg-[#4F46E5]/10 text-[#4F46E5] dark:text-white dark:bg-[#4F46E5]/20 font-semibold'
                          : 'border-[#E4E0D8] dark:border-[#262938] bg-white dark:bg-[#171926] text-[#5A5D6B] dark:text-[#9CA3AF] hover:text-[#14161F] dark:hover:text-white'
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] dark:border-[#262938]">
                <Link
                  to="/skill-gap"
                  className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#4F46E5] dark:text-[#818CF8] hover:text-[#4338CA] dark:hover:text-white transition-colors min-h-[44px]"
                >
                  <span>Open full Skill Gap Analyzer</span>
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Right Side: Detailed Sample Card */}
            <div className="lg:col-span-7 bg-white dark:bg-[#171926] border border-[#E4E0D8] dark:border-[#262938] rounded-[12px] p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-none transition-colors">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E4E0D8] dark:border-[#262938]">
                <div>
                  <span className="font-sans text-[11px] font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase">
                    Target Role
                  </span>
                  <h3 className="font-heading text-xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-white mt-0.5">
                    {roles[selectedRoleIndex].title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xs text-[#6B7280] dark:text-[#9CA3AF] block">
                    Readiness Score
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#4F46E5] dark:text-[#818CF8]">
                    {roles[selectedRoleIndex].readiness}%
                  </span>
                </div>
              </div>

              {/* Readiness Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                  <span>
                    {roles[selectedRoleIndex].matched.length} of {roles[selectedRoleIndex].matched.length + roles[selectedRoleIndex].missing.length} competencies verified
                  </span>
                  <span>{roles[selectedRoleIndex].readiness}%</span>
                </div>
                <div className="w-full bg-[#F1F3F9] dark:bg-[#0F111A] h-2 rounded-[2px] border border-[#E4E0D8] dark:border-[#262938] overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-full transition-all duration-300"
                    style={{ width: `${roles[selectedRoleIndex].readiness}%` }}
                  />
                </div>
              </div>

              {/* Matched Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#16A34A] dark:text-[#4ADE80]">
                  <Check className="h-4 w-4" strokeWidth={2} />
                  <span>Matched Skills ({roles[selectedRoleIndex].matched.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {roles[selectedRoleIndex].matched.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-xs bg-[#DCFCE7] dark:bg-[#0B2816] text-[#15803D] dark:text-[#4ADE80] border border-[#86EFAC] dark:border-[#1E502B] px-2.5 py-1 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2 pt-2 border-t border-[#E4E0D8] dark:border-[#262938]">
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#D97706] dark:text-[#FBBF24]">
                  <CircleAlert className="h-4 w-4" strokeWidth={2} />
                  <span>Missing Skills ({roles[selectedRoleIndex].missing.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {roles[selectedRoleIndex].missing.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-xs bg-[#FEF3C7] dark:bg-[#2D1807] text-[#B45309] dark:text-[#FBBF24] border border-[#FDE68A] dark:border-[#572F0E] px-2.5 py-1 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="pt-2 text-xs font-sans text-[#6B7280] dark:text-[#9CA3AF] border-t border-[#E4E0D8] dark:border-[#262938] flex items-center justify-between">
                <span>Directly syncs with your uploaded resume</span>
                <span className="font-mono text-[11px] text-[#4F46E5] dark:text-[#818CF8]">
                  {roles[selectedRoleIndex].missing.length} learning targets
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "COMING NEXT" ROW */}
      <section className="py-16 sm:py-20 bg-[#FAF8F4] dark:bg-[#0B0D17] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="font-sans font-medium text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#818CF8] block">
              IN DEVELOPMENT
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9] mt-2">
              Planned additions to the workspace.
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#5A5D6B] dark:text-[#9AA3BF] mt-2 leading-[1.6]">
              Features currently under active development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1: Application Tracker */}
            <div className="bg-white dark:bg-[#131626] border border-[#E4E0D8] dark:border-[#1E233A] rounded-[12px] p-6 space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F1F3F9] dark:bg-[#1C2035] border border-[#E2E6F0] dark:border-[#282F4E] text-[#6B7280] dark:text-[#7E88A8] flex-shrink-0">
                  <Target size={22} weight="duotone" />
                </div>
                <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#7E88A8] border border-[#E4E0D8] dark:border-[#1E233A] px-2 py-0.5 rounded-[4px]">
                  PLANNED
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9]">
                Application Tracker
              </h3>
              <p className="font-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                A focused board to log internships, submission deadlines, interview rounds, and follow-ups in one place, replacing disjointed spreadsheets.
              </p>
            </div>

            {/* Card 2: LinkedIn Optimizer */}
            <div className="bg-white dark:bg-[#131626] border border-[#E4E0D8] dark:border-[#1E233A] rounded-[12px] p-6 space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#F1F3F9] dark:bg-[#1C2035] border border-[#E2E6F0] dark:border-[#282F4E] text-[#6B7280] dark:text-[#7E88A8] flex-shrink-0">
                  <FileText size={22} weight="duotone" />
                </div>
                <span className="font-sans text-[11px] font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#7E88A8] border border-[#E4E0D8] dark:border-[#1E233A] px-2 py-0.5 rounded-[4px]">
                  PLANNED
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9]">
                LinkedIn Optimizer
              </h3>
              <p className="font-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                Audit your public profile headlines, summary sections, and experience entries against active recruiter query parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA BAND */}
      <section className="py-16 sm:py-20 bg-[#EEF0FB] dark:bg-[#12162B] border-t border-[#E4E0D8] dark:border-[#1E233A] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="font-sans font-medium text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#818CF8] block">
            GET STARTED
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9]">
            Review your resume before your next application.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#5A5D6B] dark:text-[#9AA3BF] max-w-xl leading-[1.6]">
            Takes less than sixty seconds. Free for all students and early-career job seekers.
          </p>
          {/* Action Button: ONLY the blue button is rounded-full */}
          <div className="pt-2">
            <Magnet
              padding={60}
              magnetStrength={2.5}
              tilt={8}
              scale={1.04}
              maxOffset={18}
            >
              <Link
                to={isAuthenticated ? "/resume-analyzer" : "/register"}
                className="font-sans inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-full transition-all hover:shadow-md min-h-[44px]"
              >
                Analyze my resume — it's free
              </Link>
            </Magnet>
          </div>
        </div>
      </section>

      {/* 10. REBUILT FOOTER */}
      <Footer />
    </div>
  );
}
