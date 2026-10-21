import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Target,
  PenLine,
  Map,
  Upload,
  Check,
  CircleAlert,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';
import HeroResumeToggle from '../components/HeroResumeToggle';
import GhostType from '../components/GhostType';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);

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
    <div className="landing font-editorial-sans antialiased min-h-screen selection:bg-[#4F46E5] selection:text-white">
      {/* 1. TOP NAV */}
      <header className="sticky top-0 z-40 bg-[#F3EFE6] border-b border-[#E4E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Wordmark in Fraunces serif */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="font-editorial-serif text-2xl font-semibold tracking-tight text-[#14161F] hover:opacity-90 transition-opacity"
            >
              InternIQ
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-[#5A5D6B]">
              <a href="#tools" className="hover:text-[#14161F] transition-colors py-2">
                Tools
              </a>
              <a href="#how-it-works" className="hover:text-[#14161F] transition-colors py-2">
                How it works
              </a>
              <a href="#skill-benchmark" className="hover:text-[#14161F] transition-colors py-2">
                Skill benchmark
              </a>
              <a href="#faq" className="hover:text-[#14161F] transition-colors py-2">
                FAQ
              </a>
            </nav>
          </div>

          {/* Action Links */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-[4px] transition-colors min-h-[44px]"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-[#5A5D6B] hover:text-[#14161F] transition-colors min-h-[44px]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-[4px] transition-colors min-h-[44px]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#5A5D6B] hover:text-[#14161F] rounded-[4px] border border-[#E4E0D8] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#E4E0D8] bg-[#F3EFE6] px-4 py-4 space-y-3">
            <a
              href="#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#5A5D6B] hover:text-[#14161F] py-2"
            >
              Tools
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#5A5D6B] hover:text-[#14161F] py-2"
            >
              How it works
            </a>
            <a
              href="#skill-benchmark"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#5A5D6B] hover:text-[#14161F] py-2"
            >
              Skill benchmark
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#5A5D6B] hover:text-[#14161F] py-2"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-[#E4E0D8] flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-[#4F46E5] rounded-[4px] min-h-[44px]"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#14161F] border border-[#E4E0D8] bg-white rounded-[4px] min-h-[44px]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-[#4F46E5] rounded-[4px] min-h-[44px]"
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
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F3EFE6] overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Centered vertically with Poppins font and italic accent */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
              <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] block">
                CAREER PREPARATION WORKSPACE
              </span>

              <GhostType
                text="Fix your resume"
                completions={[
                  " before they see it.",
                  " before you apply.",
                  " before it's rejected.",
                ]}
              />

              <p className="font-poppins text-base sm:text-lg text-[#5A5D6B] leading-relaxed max-w-xl">
                A straightforward ATS scanner, skill gap evaluator, and cover letter writer. Free for students and early-career job applicants.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 font-poppins">
                <Link
                  to={isAuthenticated ? "/resume-analyzer" : "/register"}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-[4px] transition-colors min-h-[44px]"
                >
                  Analyze my resume
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-[#14161F] bg-white border border-[#E4E0D8] hover:border-[#14161F]/40 rounded-[4px] transition-colors min-h-[44px]"
                >
                  See how it works
                </a>
              </div>

              {/* Small Mono Note */}
              <p className="font-editorial-mono text-xs text-[#6B7280] pt-1">
                Free. PDF, DOCX or TXT up to 5MB.
              </p>
            </div>

            {/* Right Column: HeroResumeToggle Segmented Component with Print Misregistration Offset Block */}
            <div className="lg:col-span-6 relative">
              <div className="relative">
                {/* Offset block behind hero panel */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[6px] bg-[var(--l-block)] translate-x-[8px] translate-y-[8px] sm:translate-x-[12px] sm:translate-y-[12px] -z-10 pointer-events-none"
                />
                <HeroResumeToggle />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM STRIP (Three text-only columns with mono numbers 01/02/03) */}
      <section className="py-12 bg-[#FAF8F4] border-t border-b border-[#E4E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Column 1 */}
            <div className="space-y-2">
              <span className="font-editorial-mono text-xs text-[#6B7280] block">
                01 / PARSING FILTERS
              </span>
              <h2 className="text-base font-semibold text-[#14161F]">
                Resumes get filtered before humans read them.
              </h2>
              <p className="text-sm text-[#5A5D6B] leading-relaxed">
                Applicant tracking systems discard candidates for multi-column tables, unparsed text boxes, and missing standard headers. Qualified candidates get dropped automatically.
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <span className="font-editorial-mono text-xs text-[#6B7280] block">
                02 / UNCLEAR BENCHMARKS
              </span>
              <h2 className="text-base font-semibold text-[#14161F]">
                Students don't know what roles expect.
              </h2>
              <p className="text-sm text-[#5A5D6B] leading-relaxed">
                Job postings list dozens of overlapping technologies. Without an objective baseline, candidates cannot separate core prerequisites from optional preferences.
              </p>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              <span className="font-editorial-mono text-xs text-[#6B7280] block">
                03 / BOILERPLATE DRAFTS
              </span>
              <h2 className="text-base font-semibold text-[#14161F]">
                Cover letters sound generic.
              </h2>
              <p className="text-sm text-[#5A5D6B] leading-relaxed">
                Using ungrounded generic templates yields letters that say nothing specific about actual candidate projects. Hiring managers discard them within seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE FOUR TOOLS (EDITORIAL GRID WITH UNEQUAL CELLS) */}
      <section id="tools" className="py-16 sm:py-20 bg-[#FFFFFF] border-b border-[#E4E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 max-w-2xl">
            <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] block">
              THE FOUR TOOLS
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#14161F] mt-2">
              Four focused tools. One transparent workflow.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5D6B] mt-2">
              Every tool operates on real text, concrete rubrics, and zero artificial hype.
            </p>
          </div>

          {/* Unequal Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Tool 1: Resume Analyzer (Featured: 7 cols on lg) */}
            <div className="lg:col-span-7 bg-white border border-[#E4E0D8] rounded-[6px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-editorial-mono text-xs text-[#6B7280]">
                    01 / RESUME ANALYZER
                  </span>
                  <FileText className="h-5 w-5 text-[#4F46E5]" strokeWidth={1.5} />
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] mb-2">
                  ATS scoring on a strict five-part rubric.
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed mb-6">
                  Upload your resume in PDF, DOCX, or TXT. An evaluation rubric scores five specific dimensions out of two points each, summing to a transparent score out of 10.
                </p>

                {/* Rubric Table Snippet */}
                <div className="bg-[#FAF8F4] border border-[#E4E0D8] rounded-[4px] p-4 space-y-2 mb-6">
                  <div className="font-editorial-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-2">
                    Scoring Rubric (0 - 2 points per dimension):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center justify-between border-b border-[#E4E0D8] pb-1">
                      <span className="text-[#14161F]">1. Formatting & Readability</span>
                      <span className="font-editorial-mono text-[#6B7280]">0 - 2 pts</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E4E0D8] pb-1">
                      <span className="text-[#14161F]">2. Keyword Relevance</span>
                      <span className="font-editorial-mono text-[#6B7280]">0 - 2 pts</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E4E0D8] pb-1">
                      <span className="text-[#14161F]">3. Experience & Metrics</span>
                      <span className="font-editorial-mono text-[#6B7280]">0 - 2 pts</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#E4E0D8] pb-1">
                      <span className="text-[#14161F]">4. Structure & Order</span>
                      <span className="font-editorial-mono text-[#6B7280]">0 - 2 pts</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[#14161F]">5. Clarity & Professional Tone</span>
                    <span className="font-editorial-mono text-[#6B7280]">0 - 2 pts</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] flex items-center justify-between">
                <span className="font-editorial-mono text-xs text-[#6B7280]">
                  Immediate scoring · Line-by-line feedback
                </span>
                <Link
                  to="/resume-analyzer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] min-h-[44px]"
                >
                  <span>Open tool</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Tool 2: Skill Gap Analyzer (5 cols on lg) */}
            <div className="lg:col-span-5 bg-white border border-[#E4E0D8] rounded-[6px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-editorial-mono text-xs text-[#6B7280]">
                    02 / SKILL GAP ANALYZER
                  </span>
                  <Target className="h-5 w-5 text-[#4F46E5]" strokeWidth={1.5} />
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] mb-2">
                  Target role comparison and readiness index.
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed mb-6">
                  Select your target role. Compare your extracted resume skills against expected requirements to see what you match and what you need to learn next.
                </p>

                {/* Role Snippet Preview */}
                <div className="bg-[#FAF8F4] border border-[#E4E0D8] rounded-[4px] p-4 mb-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-[#14161F]">Frontend Developer</span>
                    <span className="font-editorial-mono text-[#4F46E5] font-semibold">67% Match</span>
                  </div>
                  <div className="w-full bg-white h-2 rounded-[2px] border border-[#E4E0D8] overflow-hidden">
                    <div className="bg-[#4F46E5] h-full" style={{ width: '67%' }} />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="font-editorial-mono text-[10px] text-[#15803D] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.5 rounded-[3px]">
                      + React
                    </span>
                    <span className="font-editorial-mono text-[10px] text-[#15803D] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.5 rounded-[3px]">
                      + Git
                    </span>
                    <span className="font-editorial-mono text-[10px] text-[#B45309] bg-[#FFFBEB] border border-[#FEF3C7] px-1.5 py-0.5 rounded-[3px]">
                      - TypeScript
                    </span>
                    <span className="font-editorial-mono text-[10px] text-[#B45309] bg-[#FFFBEB] border border-[#FEF3C7] px-1.5 py-0.5 rounded-[3px]">
                      - Jest
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] flex items-center justify-between">
                <span className="font-editorial-mono text-xs text-[#6B7280]">
                  8 technical & product tracks
                </span>
                <Link
                  to="/skill-gap"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] min-h-[44px]"
                >
                  <span>Compare skills</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Tool 3: Cover Letter Generator (5 cols on lg) */}
            <div className="lg:col-span-5 bg-white border border-[#E4E0D8] rounded-[6px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-editorial-mono text-xs text-[#6B7280]">
                    03 / COVER LETTER GENERATOR
                  </span>
                  <PenLine className="h-5 w-5 text-[#4F46E5]" strokeWidth={1.5} />
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] mb-2">
                  Grounded in your actual work history.
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed mb-6">
                  Provide a target company, role title, and job description. InternIQ produces a concise 250 to 400 word letter referencing your verified background, ready to edit, copy, or export to PDF.
                </p>

                {/* Letter Snippet Preview */}
                <div className="bg-[#FAF8F4] border border-[#E4E0D8] rounded-[4px] p-4 mb-6 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E4E0D8] pb-1.5 font-editorial-mono text-[11px] text-[#6B7280]">
                    <span>Target: Stripe · Intern</span>
                    <span>312 words</span>
                  </div>
                  <p className="text-[#5A5D6B] italic leading-relaxed text-[11px]">
                    "Having built responsive frontend systems using React and TypeScript at university hackathons, I was drawn to Stripe's emphasis on reliable developer infrastructure..."
                  </p>
                  <div className="flex gap-2 pt-1 font-editorial-mono text-[10px] text-[#14161F]">
                    <span className="border border-[#E4E0D8] bg-white px-2 py-0.5 rounded-[3px]">Copy text</span>
                    <span className="border border-[#E4E0D8] bg-white px-2 py-0.5 rounded-[3px]">Export PDF</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] flex items-center justify-between">
                <span className="font-editorial-mono text-xs text-[#6B7280]">
                  Factually tailored · No fluff
                </span>
                <Link
                  to="/cover-letter"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] min-h-[44px]"
                >
                  <span>Draft letter</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Tool 4: Roadmap Provider (7 cols on lg) */}
            <div className="lg:col-span-7 bg-white border border-[#E4E0D8] rounded-[6px] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-editorial-mono text-xs text-[#6B7280]">
                    04 / ROADMAP PROVIDER
                  </span>
                  <Map className="h-5 w-5 text-[#4F46E5]" strokeWidth={1.5} />
                </div>
                <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#14161F] mb-2">
                  Curated learning paths on PathForge.
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed mb-6">
                  When you identify a skill gap, jump directly to structured, community-tested roadmaps across modern engineering and data disciplines without searching blindly.
                </p>

                {/* Roadmaps UI Snippet */}
                <div className="bg-[#FAF8F4] border border-[#E4E0D8] rounded-[4px] p-4 mb-6">
                  <div className="font-editorial-mono text-[11px] text-[#6B7280] uppercase tracking-wider mb-2">
                    Available Pathways on PathForge:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-white border border-[#E4E0D8] rounded-[3px] text-center font-medium text-[#14161F]">
                      Frontend Dev
                    </div>
                    <div className="p-2 bg-white border border-[#E4E0D8] rounded-[3px] text-center font-medium text-[#14161F]">
                      Backend Dev
                    </div>
                    <div className="p-2 bg-white border border-[#E4E0D8] rounded-[3px] text-center font-medium text-[#14161F]">
                      Data Analyst
                    </div>
                    <div className="p-2 bg-white border border-[#E4E0D8] rounded-[3px] text-center font-medium text-[#14161F]">
                      Machine Learning
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E0D8] flex items-center justify-between">
                <span className="font-editorial-mono text-xs text-[#6B7280]">
                  External learning companion
                </span>
                <a
                  href="https://path-forge-amber.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] min-h-[44px]"
                >
                  <span>Explore PathForge</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (Three horizontal steps with large Fraunces numerals 1, 2, 3) */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-[#F3EFE6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] block">
              PROCESS
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#14161F] mt-2">
              How it works
            </h2>
            <p className="text-sm sm:text-base text-[#5A5D6B] mt-2">
              Three straightforward steps from raw resume to targeted application.
            </p>
          </div>

          {/* Connected Steps Grid */}
          <div className="relative">
            {/* Thin straight connecting line across steps (desktop) */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-px bg-[#E4E0D8] -z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 relative z-10">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="w-14 h-14 bg-white border border-[#E4E0D8] rounded-[4px] flex items-center justify-center font-editorial-serif text-2xl font-semibold text-[#14161F]">
                  1
                </div>
                <span className="font-editorial-mono text-xs text-[#6B7280] block">
                  STEP 01
                </span>
                <h3 className="text-lg font-semibold text-[#14161F]">
                  Upload your resume
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed">
                  Drop your PDF, Word document, or plain text file. Text is parsed directly in your browser with zero manual re-typing required.
                </p>
              </div>

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="w-14 h-14 bg-white border border-[#E4E0D8] rounded-[4px] flex items-center justify-center font-editorial-serif text-2xl font-semibold text-[#14161F]">
                  2
                </div>
                <span className="font-editorial-mono text-xs text-[#6B7280] block">
                  STEP 02
                </span>
                <h3 className="text-lg font-semibold text-[#14161F]">
                  See your score and skills
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed">
                  Get your ATS rating broken down across the five rubric dimensions. Review line-level recommendations and catalog your extracted skillset.
                </p>
              </div>

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="w-14 h-14 bg-white border border-[#E4E0D8] rounded-[4px] flex items-center justify-center font-editorial-serif text-2xl font-semibold text-[#14161F]">
                  3
                </div>
                <span className="font-editorial-mono text-xs text-[#6B7280] block">
                  STEP 03
                </span>
                <h3 className="text-lg font-semibold text-[#14161F]">
                  Close the gap and apply
                </h3>
                <p className="text-sm text-[#5A5D6B] leading-relaxed">
                  Check missing requirements against your target role, generate a tailored cover letter, and download an ATS-compliant resume template.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DARK SECTION (#0F111A) FOR SKILL GAP IN DETAIL */}
      <section id="skill-benchmark" className="py-16 sm:py-20 bg-[#0F111A] text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left Side: Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#9CA3AF] block">
                SKILL GAP BENCHMARK
              </span>

              <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-white leading-tight">
                Know exactly what to study before your interview.
              </h2>

              <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
                Instead of guessing what hiring managers look for, compare your profile against standardized industry criteria across eight technical and product tracks. No vague advice—only clear matched competencies and missing skills.
              </p>

              {/* Interactive Role Switcher */}
              <div className="pt-2 space-y-2">
                <span className="font-editorial-mono text-xs text-[#9CA3AF] block">
                  Select a role to preview benchmarks:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r, idx) => (
                    <button
                      key={r.title}
                      type="button"
                      onClick={() => setSelectedRoleIndex(idx)}
                      className={`text-left text-xs px-3 py-2.5 rounded-[4px] border transition-colors min-h-[44px] ${
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
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#818CF8] hover:text-white transition-colors min-h-[44px]"
                >
                  <span>Open full Skill Gap Analyzer</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Right Side: Detailed Sample Card */}
            <div className="lg:col-span-7 bg-[#171926] border border-[#262938] rounded-[6px] p-6 sm:p-8 space-y-6">
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#262938]">
                <div>
                  <span className="font-editorial-mono text-[11px] text-[#9CA3AF] uppercase">
                    Target Role
                  </span>
                  <h3 className="font-editorial-serif text-xl font-normal text-white mt-0.5">
                    {roles[selectedRoleIndex].title}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-editorial-mono text-xs text-[#9CA3AF] block">
                    Readiness Score
                  </span>
                  <span className="font-editorial-mono text-2xl font-semibold text-[#818CF8]">
                    {roles[selectedRoleIndex].readiness}%
                  </span>
                </div>
              </div>

              {/* Readiness Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-editorial-mono text-[#9CA3AF]">
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
                <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#15803D]">
                  <Check className="h-4 w-4" strokeWidth={1.5} />
                  <span className="uppercase font-medium">Matched Skills ({roles[selectedRoleIndex].matched.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {roles[selectedRoleIndex].matched.map((s) => (
                    <span
                      key={s}
                      className="font-editorial-mono text-xs bg-[#0B2816] text-[#4ADE80] border border-[#1E502B] px-2.5 py-1 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills (Amber #B45309) */}
              <div className="space-y-2 pt-2 border-t border-[#262938]">
                <div className="flex items-center gap-2 text-xs font-editorial-mono text-[#F59E0B]">
                  <CircleAlert className="h-4 w-4" strokeWidth={1.5} />
                  <span className="uppercase font-medium">Missing Skills ({roles[selectedRoleIndex].missing.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {roles[selectedRoleIndex].missing.map((s) => (
                    <span
                      key={s}
                      className="font-editorial-mono text-xs bg-[#2D1807] text-[#FBBF24] border border-[#572F0E] px-2.5 py-1 rounded-[4px]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="pt-2 text-xs text-[#9CA3AF] border-t border-[#262938] flex items-center justify-between">
                <span>Directly syncs with your uploaded resume</span>
                <span className="font-editorial-mono text-[11px] text-[#818CF8]">
                  {roles[selectedRoleIndex].missing.length} learning targets
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. "COMING NEXT" ROW */}
      <section className="py-16 sm:py-20 bg-[#FAF8F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] block">
              IN DEVELOPMENT
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#14161F] mt-2">
              Planned additions to the workspace.
            </h2>
            <p className="text-sm sm:text-base text-[#5A5D6B] mt-2">
              Features currently under active development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1: Application Tracker */}
            <div className="bg-white border border-[#E4E0D8] rounded-[6px] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Target className="h-5 w-5 text-[#6B7280]" strokeWidth={1.5} />
                <span className="font-editorial-mono text-[10px] uppercase tracking-wider text-[#6B7280] border border-[#E4E0D8] px-2 py-0.5 rounded-[4px]">
                  PLANNED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#14161F]">
                Application Tracker
              </h3>
              <p className="text-sm text-[#5A5D6B] leading-relaxed">
                A focused board to log internships, submission deadlines, interview rounds, and follow-ups in one place, replacing disjointed spreadsheets.
              </p>
            </div>

            {/* Card 2: LinkedIn Optimizer */}
            <div className="bg-white border border-[#E4E0D8] rounded-[6px] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <FileText className="h-5 w-5 text-[#6B7280]" strokeWidth={1.5} />
                <span className="font-editorial-mono text-[10px] uppercase tracking-wider text-[#6B7280] border border-[#E4E0D8] px-2 py-0.5 rounded-[4px]">
                  PLANNED
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#14161F]">
                LinkedIn Optimizer
              </h3>
              <p className="text-sm text-[#5A5D6B] leading-relaxed">
                Audit your public profile headlines, summary sections, and experience entries against active recruiter query parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION (Accessible Accordion) */}
      <section id="faq" className="py-16 sm:py-20 bg-[#FFFFFF] border-t border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-left">
            <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] block">
              DETAILS
            </span>
            <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#14161F] mt-2">
              Frequently asked questions
            </h2>
          </div>

          <div className="border-t border-[#E4E0D8] divide-y divide-[#E4E0D8]">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full flex items-center justify-between text-left group min-h-[44px]"
                  >
                    <span className="text-base sm:text-lg font-medium text-[#14161F] group-hover:text-[#4F46E5] transition-colors pr-4">
                      {faq.q}
                    </span>
                    <span className="text-[#5A5D6B] flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" strokeWidth={1.5} />
                      ) : (
                        <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div id={`faq-answer-${idx}`} className="pt-3 pr-6 text-sm text-[#5A5D6B] leading-relaxed">
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
      <section className="py-16 sm:py-20 bg-[#EEF0FB] border-t border-[#E4E0D8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <span className="font-editorial-mono text-xs uppercase tracking-wider text-[#6B7280] block">
            GET STARTED
          </span>
          <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#14161F]">
            Review your resume before your next application.
          </h2>
          <p className="text-sm sm:text-base text-[#5A5D6B] max-w-xl">
            Takes less than sixty seconds. Free for all students and early-career job seekers.
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? "/resume-analyzer" : "/register"}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-[4px] transition-colors min-h-[44px]"
            >
              Analyze my resume — it's free
            </Link>
          </div>
        </div>
      </section>

      {/* 10. MINIMAL FOOTER */}
      <footer className="py-12 bg-[#F3EFE6] border-t border-[#E4E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#E4E0D8]">
            <div>
              <span className="font-editorial-serif text-2xl font-semibold tracking-tight text-[#14161F]">
                InternIQ
              </span>
              <p className="text-xs text-[#5A5D6B] mt-1">
                Practical career preparation for students and early-career applicants.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-[#5A5D6B]">
              <a href="#tools" className="hover:text-[#14161F] transition-colors py-2">Tools</a>
              <a href="#how-it-works" className="hover:text-[#14161F] transition-colors py-2">How it works</a>
              <a href="#faq" className="hover:text-[#14161F] transition-colors py-2">FAQ</a>
              <Link to="/login" className="hover:text-[#14161F] transition-colors py-2">Log in</Link>
              <Link to="/register" className="hover:text-[#14161F] transition-colors py-2">Register</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-editorial-mono text-[#6B7280]">
            <div>
              Built by a student at UVCE, Bengaluru.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#14161F] transition-colors inline-flex items-center gap-1 py-1"
              >
                <span>GitHub</span>
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
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
