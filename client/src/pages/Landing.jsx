import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Check,
  CircleAlert,
  ChevronDown,
  ChevronUp,
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
import ProblemStrip from '../components/ProblemStrip';
import ToolsSection from '../components/ToolsSection';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Tools', href: '#tools' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Skill benchmark', href: '#skill-benchmark' },
    { label: 'FAQ', href: '#faq' },
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
    const sectionIds = ['overview', 'tools', 'how-it-works', 'skill-benchmark', 'faq'];

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;
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

  const faqs = [
    {
      q: 'Is InternIQ free to use?',
      a: 'Yes. InternIQ is completely free for students and early-career job seekers. There are no fees, paywalls, or credit card requirements.',
    },
    {
      q: 'Which file types are supported?',
      a: 'You can upload PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) files up to 5MB in size. Text is extracted directly in your browser.',
    },
    {
      q: 'Is my resume stored or used for model training?',
      a: 'When signed in, your analysis history is saved to your private account for tracking your progress over time. Your resume text is processed through Google Gemini API calls with strict privacy controls and is never sold or used for public training data.',
    },
    {
      q: 'How is the score calculated?',
      a: 'The ATS score is evaluated against a 5-part rubric: Formatting and ATS-readability (0-2 pts), Keyword relevance (0-2 pts), Experience quality and metrics (0-2 pts), Structure and completeness (0-2 pts), and Clarity and professional tone (0-2 pts). The sum forms your final score out of 10.',
    },
    {
      q: 'Which career roles are supported in the Skill Gap Analyzer?',
      a: 'We currently support eight primary career roles: Frontend Developer, Backend Developer, Full Stack Developer, Data Analyst, AI/ML Engineer, Mobile Developer, Product Manager, and Business Analyst.',
    },
  ];

  return (
    <div className="landing font-editorial-sans antialiased min-h-screen selection:bg-[#4F46E5] selection:text-white relative bg-transparent transition-colors">
      {/* 1. TOP NAV */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Wordmark in Fraunces serif */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveNavIndex(0);
              }}
              className="font-heading text-2xl font-semibold tracking-[-0.02em] text-white hover:opacity-90 transition-opacity"
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
              theme="dark"
              size="sm"
              frame={true}
              particleCount={15}
              spread={56}
              animationTime={600}
              timeVariance={300}
              gooeyness={0.5}
              wobble={0.5}
              hoverEffect={true}
              colors={['#818CF8', '#6366F1', '#38BDF8']}
            />
          </div>

          {/* Action Links */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-300 hover:text-white rounded-[4px] border border-white/15 bg-white/5 hover:bg-white/15 transition-colors flex items-center justify-center min-h-[40px] min-w-[40px] cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4.5 w-4.5 text-amber-400" strokeWidth={1.75} />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-300" strokeWidth={1.75} />
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
                  className="inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors min-h-[44px]"
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
              className="p-2 text-slate-300 hover:text-white rounded-[4px] border border-white/15 bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" strokeWidth={1.5} /> : <Moon className="h-5 w-5" strokeWidth={1.5} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-[4px] border border-white/15 bg-white/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E4E0D8] dark:border-[#1E233A] bg-[#F3EFE6]/90 dark:bg-[#0F1220]/90 backdrop-blur-md px-4 py-4 space-y-2 transition-colors">
            {navItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavChange(idx, item);
                }}
                className={`block text-sm font-medium py-2 transition-colors ${
                  activeNavIndex === idx
                    ? 'text-[#4F46E5] dark:text-[#818CF8] font-semibold'
                    : 'text-[#5A5D6B] dark:text-[#9AA3BF] hover:text-[#14161F] dark:hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#E4E0D8] dark:border-[#1E233A] flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-full min-h-[44px] shadow-xs"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#14161F] dark:text-white border border-[#E4E0D8] dark:border-[#1E233A] bg-white dark:bg-[#131626] rounded-[4px] min-h-[44px]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-full min-h-[44px] shadow-xs"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="overview" className="scroll-mt-20 relative min-h-[560px] sm:min-h-[640px] flex items-center justify-center overflow-hidden transition-colors">
        {/* Centered Hero Content with GhostType - NO CARD */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
          <span className="font-sans text-xs uppercase tracking-widest text-[#818CF8] block font-semibold mb-6 px-3.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/40 backdrop-blur-md shadow-xs">
            CAREER PREPARATION WORKSPACE
          </span>

          <div className="w-full flex justify-center text-white">
            <GhostType
              text="Fix your resume"
              completions={[
                " before they see it.",
                " before you apply.",
                " before it's rejected.",
              ]}
            />
          </div>

          <p className="font-sans text-base sm:text-lg text-slate-200 leading-[1.6] max-w-2xl mt-4">
            A straightforward ATS scanner, skill gap evaluator, and cover letter writer. Free for students and early-career job applicants.
          </p>

          {/* Action Buttons */}
          <div className="pt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5 font-sans w-full sm:w-auto">
            <Link
              to={isAuthenticated ? "/resume-analyzer" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 text-sm font-medium text-white bg-[#1e3fd8] hover:bg-[#2563eb] rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/30 min-h-[44px]"
            >
              Analyze my resume
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full backdrop-blur-md transition-all min-h-[44px] shadow-xs"
            >
              See how it works
            </a>
          </div>

          {/* Small Note */}
          <p className="font-sans text-xs text-slate-400 pt-3">
            Free. PDF, DOCX or TXT up to 5MB.
          </p>
        </div>
      </section>

      {/* 3. PROBLEM STRIP */}
      <ProblemStrip />

      {/* 4. THE FOUR TOOLS */}
      <ToolsSection />

      {/* 5. HOW IT WORKS (Three horizontal steps with large Fraunces numerals 1, 2, 3) */}
      <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20 bg-[#F3EFE6] dark:bg-[#0F1220] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="font-sans font-medium text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#818CF8] block">
              PROCESS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9] mt-2">
              How it works
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#5A5D6B] dark:text-[#9AA3BF] mt-2 leading-[1.6]">
              Three straightforward steps from raw resume to targeted application.
            </p>
          </div>

          {/* Connected Steps Grid */}
          <div className="relative">
            {/* Thin straight connecting line across steps (desktop) */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-px bg-[#E4E0D8] dark:bg-[#1E233A] -z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="w-14 h-14 bg-white dark:bg-[#131626] border border-[#E4E0D8] dark:border-[#1E233A] rounded-[6px] flex items-center justify-center font-heading text-2xl font-semibold text-[#14161F] dark:text-white transition-colors">
                  1
                </div>
                <span className="font-sans font-medium text-xs text-[#6B7280] dark:text-[#7E88A8] block">
                  Step 1
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9]">
                  Upload your resume
                </h3>
                <p className="font-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                  Drop your PDF, Word document, or plain text file. Text is parsed directly in your browser with zero manual re-typing required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="w-14 h-14 bg-white dark:bg-[#131626] border border-[#E4E0D8] dark:border-[#1E233A] rounded-[6px] flex items-center justify-center font-heading text-2xl font-semibold text-[#14161F] dark:text-white transition-colors">
                  2
                </div>
                <span className="font-sans font-medium text-xs text-[#6B7280] dark:text-[#7E88A8] block">
                  Step 2
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9]">
                  See your score and skills
                </h3>
                <p className="font-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                  Get your ATS rating broken down across the five rubric dimensions. Review line-level recommendations and catalog your extracted skillset.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="w-14 h-14 bg-white dark:bg-[#131626] border border-[#E4E0D8] dark:border-[#1E233A] rounded-[6px] flex items-center justify-center font-heading text-2xl font-semibold text-[#14161F] dark:text-white transition-colors">
                  3
                </div>
                <span className="font-sans font-medium text-xs text-[#6B7280] dark:text-[#7E88A8] block">
                  Step 3
                </span>
                <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9]">
                  Close the gap and apply
                </h3>
                <p className="font-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                  Check missing requirements against your target role, generate a tailored cover letter, and download an ATS-compliant resume template.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DARK SECTION (#0F111A) FOR SKILL GAP IN DETAIL */}
      <section id="skill-benchmark" className="scroll-mt-20 py-16 sm:py-20 bg-[#0F111A] text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Side: Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-sans font-medium text-xs uppercase tracking-wider text-[#9CA3AF] block">
                SKILL GAP BENCHMARK
              </span>

              <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-white leading-tight">
                Know exactly what to study before your interview.
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#9CA3AF] leading-[1.6]">
                Instead of guessing what hiring managers look for, compare your profile against standardized industry criteria across eight technical and product tracks. No vague advice—only clear matched competencies and missing skills.
              </p>

              {/* Interactive Role Switcher */}
              <div className="pt-2 space-y-2">
                <span className="font-sans text-xs text-[#9CA3AF] block">
                  Select a role to preview benchmarks:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r, idx) => (
                    <button
                      key={r.title}
                      type="button"
                      onClick={() => setSelectedRoleIndex(idx)}
                      className={`text-left text-xs font-sans px-3 py-2.5 rounded-[4px] border transition-colors min-h-[44px] cursor-pointer ${
                        selectedRoleIndex === idx
                          ? 'border-[#4F46E5] bg-[#4F46E5]/15 text-white font-medium'
                          : 'border-[#262938] bg-[#171926] text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#262938]">
                <Link
                  to="/skill-gap"
                  className="inline-flex items-center gap-2 text-sm font-sans font-medium text-[#818CF8] hover:text-white transition-colors min-h-[44px]"
                >
                  <span>Open full Skill Gap Analyzer</span>
                  <ArrowUpRight size={16} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Right Side: Detailed Sample Card */}
            <div className="lg:col-span-7 bg-[#171926] border border-[#262938] rounded-[6px] p-6 sm:p-8 space-y-6">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#262938]">
                <div>
                  <span className="font-sans text-[11px] font-medium text-[#9CA3AF] uppercase">
                    Target Role
                  </span>
                  <h3 className="font-heading text-xl font-semibold tracking-[-0.02em] text-white mt-0.5">
                    {roles[selectedRoleIndex].title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xs text-[#9CA3AF] block">
                    Readiness Score
                  </span>
                  <span className="font-mono text-2xl font-bold text-[#818CF8]">
                    {roles[selectedRoleIndex].readiness}%
                  </span>
                </div>
              </div>

              {/* Readiness Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#9CA3AF]">
                  <span>
                    {roles[selectedRoleIndex].matched.length} of {roles[selectedRoleIndex].matched.length + roles[selectedRoleIndex].missing.length} competencies verified
                  </span>
                  <span>{roles[selectedRoleIndex].readiness}%</span>
                </div>
                <div className="w-full bg-[#0F111A] h-2 rounded-[2px] border border-[#262938] overflow-hidden">
                  <div
                    className="bg-[#4F46E5] h-full transition-all duration-300"
                    style={{ width: `${roles[selectedRoleIndex].readiness}%` }}
                  />
                </div>
              </div>

              {/* Matched Skills (Green #15803D) */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#4ADE80]">
                  <Check className="h-4 w-4" strokeWidth={2} />
                  <span>Matched Skills ({roles[selectedRoleIndex].matched.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {roles[selectedRoleIndex].matched.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-xs bg-[#0B2816] text-[#4ADE80] border border-[#1E502B] px-2.5 py-1 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills (Amber #B45309) */}
              <div className="space-y-2 pt-2 border-t border-[#262938]">
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#FBBF24]">
                  <CircleAlert className="h-4 w-4" strokeWidth={2} />
                  <span>Missing Skills ({roles[selectedRoleIndex].missing.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {roles[selectedRoleIndex].missing.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-xs bg-[#2D1807] text-[#FBBF24] border border-[#572F0E] px-2.5 py-1 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="pt-2 text-xs font-sans text-[#9CA3AF] border-t border-[#262938] flex items-center justify-between">
                <span>Directly syncs with your uploaded resume</span>
                <span className="font-mono text-[11px] text-[#818CF8]">
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

      {/* 8. FAQ SECTION (Accessible Accordion) */}
      <section id="faq" className="scroll-mt-20 py-16 sm:py-20 bg-[#FFFFFF] dark:bg-[#0B0D17] border-t border-[#E4E0D8] dark:border-[#1E233A] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-left">
            <span className="font-sans font-medium text-xs uppercase tracking-wider text-[#6B7280] dark:text-[#818CF8] block">
              DETAILS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-[#F1F3F9] mt-2">
              Frequently asked questions
            </h2>
          </div>

          <div className="border-t border-[#E4E0D8] dark:border-[#1E233A] divide-y divide-[#E4E0D8] dark:divide-[#1E233A]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full flex items-center justify-between text-left group min-h-[44px] cursor-pointer"
                  >
                    <span className="font-sans text-base sm:text-lg font-medium text-[#14161F] dark:text-[#F1F3F9] group-hover:text-[#4F46E5] dark:group-hover:text-[#818CF8] transition-colors pr-4">
                      {faq.q}
                    </span>
                    <span className="text-[#5A5D6B] dark:text-[#9AA3BF] flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" strokeWidth={1.5} />
                      ) : (
                        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div id={`faq-answer-${idx}`} className="pt-3 pr-6 font-sans text-sm text-[#5A5D6B] dark:text-[#9AA3BF] leading-[1.6]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BAND */}
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
            <Link
              to={isAuthenticated ? "/resume-analyzer" : "/register"}
              className="font-sans inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-full transition-all hover:shadow-md min-h-[44px]"
            >
              Analyze my resume — it's free
            </Link>
          </div>
        </div>
      </section>

      {/* 10. MINIMAL FOOTER */}
      <footer className="py-12 bg-[#F3EFE6] dark:bg-[#0F1220] border-t border-[#E4E0D8] dark:border-[#1E233A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#E4E0D8] dark:border-[#1E233A]">
            <div>
              <span className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[#14161F] dark:text-white">
                InternIQ
              </span>
              <p className="font-sans text-xs text-[#5A5D6B] dark:text-[#9AA3BF] mt-1 leading-[1.6]">
                Practical career preparation for students and early-career applicants.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs font-sans text-[#5A5D6B] dark:text-[#9AA3BF]">
              <a href="#tools" className="hover:text-[#14161F] dark:hover:text-white transition-colors py-2">Tools</a>
              <a href="#how-it-works" className="hover:text-[#14161F] dark:hover:text-white transition-colors py-2">How it works</a>
              <a href="#faq" className="hover:text-[#14161F] dark:hover:text-white transition-colors py-2">FAQ</a>
              <Link to="/login" className="hover:text-[#14161F] dark:hover:text-white transition-colors py-2">Log in</Link>
              <Link to="/register" className="hover:text-[#14161F] dark:hover:text-white transition-colors py-2">Register</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-[#6B7280] dark:text-[#7E88A8]">
            <div>
              Built by a student at UVCE, Bengaluru.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#14161F] dark:hover:text-white transition-colors inline-flex items-center gap-1 py-1"
              >
                <span>GitHub</span>
                <ArrowUpRight size={14} weight="bold" />
              </a>
              <span>·</span>
              <span>© {new Date().getFullYear()} InternIQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
