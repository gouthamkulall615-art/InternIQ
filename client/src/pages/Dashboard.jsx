import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch,
  FileSignature,
  Map,
  Target,
  BrainCircuit,
  ArrowRight,
  Award,
  Layers,
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    atsScore: null,
    skillsToLearn: null,
    lettersGenerated: null,
    loading: true,
  });

  // Attempt to load genuine user statistics if available in the app/storage
  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const storedScore = localStorage.getItem('interniq_ats_score');
        const storedLetters = localStorage.getItem('interniq_cover_letters_count');
        const storedSkills = localStorage.getItem('interniq_skills_gap_count');

        let atsScore = storedScore ? Number(storedScore) : null;
        let lettersGenerated = storedLetters ? Number(storedLetters) : null;
        let skillsToLearn = storedSkills ? Number(storedSkills) : null;

        // Try querying the latest analysis from API if authenticated and score is not in localStorage
        const token = localStorage.getItem('token');
        if (token && atsScore === null) {
          try {
            const res = await api.get('/api/analyzer/latest', {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data?.atsScore !== undefined) {
              atsScore = res.data.atsScore;
            }
          } catch {
            // Silently fall back to empty state if no analysis exists
          }
        }

        if (isMounted) {
          setStats({
            atsScore,
            skillsToLearn,
            lettersGenerated,
            loading: false,
          });
        }
      } catch {
        if (isMounted) {
          setStats({
            atsScore: null,
            skillsToLearn: null,
            lettersGenerated: null,
            loading: false,
          });
        }
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      id: 'ats-score',
      label: 'Latest ATS Score',
      value: stats.atsScore !== null ? `${stats.atsScore}/10` : '--',
      hint:
        stats.atsScore !== null
          ? 'Based on your latest scan'
          : 'Analyze your resume to see your score',
      icon: Award,
      href: '/resume-analyzer',
      tintBg: 'var(--tint-resume-bg)',
      tintIcon: 'var(--tint-resume-icon)',
    },
    {
      id: 'skills-gap',
      label: 'Skills to Learn',
      value: stats.skillsToLearn !== null ? stats.skillsToLearn : '--',
      hint:
        stats.skillsToLearn !== null
          ? 'Identified gap areas'
          : 'Check your skill gaps against target roles',
      icon: BrainCircuit,
      href: '/skill-gap',
      tintBg: 'var(--tint-skill-bg)',
      tintIcon: 'var(--tint-skill-icon)',
    },
    {
      id: 'cover-letters',
      label: 'Cover Letters Generated',
      value: stats.lettersGenerated !== null ? stats.lettersGenerated : '--',
      hint:
        stats.lettersGenerated !== null
          ? 'Tailored letters created'
          : 'Generate your first tailored cover letter',
      icon: FileSignature,
      href: '/cover-letter',
      tintBg: 'var(--tint-cover-bg)',
      tintIcon: 'var(--tint-cover-icon)',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      {/* 1. Header Greeting */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
          Welcome back
          {user?.name ? (
            <>
              ,{' '}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                {user.name.split(' ')[0]}
              </span>
            </>
          ) : (
            ''
          )}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Your all-in-one platform to prepare for and land your dream internship.
        </p>
      </div>

      {/* 2. Summary Strip (3 compact stat cards with real data or elegant empty state) */}
      <section aria-label="Dashboard Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.id}
                to={stat.href}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)] hover:border-[var(--primary)]/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {stat.label}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      {stats.loading ? (
                        <div className="h-8 w-14 bg-[var(--surface-muted)] rounded-md animate-pulse" />
                      ) : (
                        <span
                          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                            stat.value === '--'
                              ? 'text-[var(--text-muted)] font-medium'
                              : 'text-[var(--text)]'
                          }`}
                        >
                          {stat.value}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{ backgroundColor: stat.tintBg, color: stat.tintIcon }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border)]/70 flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span className="truncate pr-2">{stat.hint}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-all duration-150 group-hover:translate-x-0.5 flex-shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Bento Grid for Active Tools */}
      <section aria-label="Tools Grid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Resume Analyzer (Featured card, spans 2 columns on desktop) */}
          <Link
            to="/resume-analyzer"
            className="group relative col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between rounded-[20px] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--primary-soft)]/50 dark:to-[var(--primary-soft)]/20 border border-[var(--border)] hover:border-[var(--tint-resume-border)] p-6 sm:p-7 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_14px_28px_-6px_rgba(79,70,229,0.12),0_8px_10px_-6px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_14px_28px_-6px_rgba(129,140,248,0.2)] hover:-translate-y-[3px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                {/* 48px rounded-xl tinted square for the icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105"
                  style={{
                    backgroundColor: 'var(--tint-resume-bg)',
                    color: 'var(--tint-resume-icon)',
                  }}
                >
                  <FileSearch className="h-6 w-6" />
                </div>

                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary)]/20">
                  <span>Featured Tool</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] mb-2 tracking-tight">
                Resume Analyzer
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-xl mb-6">
                Upload your resume and get an instant ATS score with actionable improvement suggestions.
              </p>

              {/* Feature highlight badges */}
              <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                  Instant ATS Score
                </span>
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                  Actionable Recommendations
                </span>
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                  Skill Extraction
                </span>
              </div>
            </div>

            {/* The ONLY solid primary button on the page */}
            <div className="pt-2">
              <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-all shadow-xs group-hover:shadow-md">
                <span>Open Tool</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Card 2: Cover Letter Generator (Standard card) */}
          <Link
            to="/cover-letter"
            className="group relative col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-between rounded-[20px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--tint-cover-border)] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(124,58,237,0.1),0_6px_8px_-4px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_24px_-4px_rgba(167,139,250,0.2)] hover:-translate-y-[3px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <div>
              {/* 48px rounded-xl tinted square for the icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs mb-5 transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--tint-cover-bg)',
                  color: 'var(--tint-cover-icon)',
                }}
              >
                <FileSignature className="h-6 w-6" />
              </div>

              <h2 className="text-lg font-bold text-[var(--text)] mb-2 tracking-tight">
                Cover Letter Generator
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                Create tailored cover letters instantly based on your resume and job description.
              </p>
            </div>

            {/* Subtle text link plus arrow that shifts 3-4px right on hover */}
            <div className="pt-4 border-t border-[var(--border)]/70 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                <span>Open tool</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Card 3: Roadmap Provider (Standard card, external link) */}
          <a
            href="https://path-forge-amber.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-between rounded-[20px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--tint-roadmap-border)] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(13,148,136,0.1),0_6px_8px_-4px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_24px_-4px_rgba(45,212,191,0.2)] hover:-translate-y-[3px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <div>
              {/* 48px rounded-xl tinted square for the icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs mb-5 transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--tint-roadmap-bg)',
                  color: 'var(--tint-roadmap-icon)',
                }}
              >
                <Map className="h-6 w-6" />
              </div>

              <h2 className="text-lg font-bold text-[var(--text)] mb-2 tracking-tight">
                Roadmap Provider
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                Explore structured, ready-made roadmaps across multiple career fields to guide your learning path.
              </p>
            </div>

            {/* Subtle text link plus arrow that shifts 3-4px right on hover */}
            <div className="pt-4 border-t border-[var(--border)]/70 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                <span>Open tool</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </a>

          {/* Card 4: Skill Gap Analyzer (Standard card, spans 2 columns on desktop for harmonious balance) */}
          <Link
            to="/skill-gap"
            className="group relative col-span-1 md:col-span-1 lg:col-span-2 flex flex-col justify-between rounded-[20px] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--tint-skill-border)] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-4px_rgba(217,119,6,0.1),0_6px_8px_-4px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_24px_-4px_rgba(251,191,36,0.2)] hover:-translate-y-[3px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            <div>
              {/* 48px rounded-xl tinted square for the icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs mb-5 transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--tint-skill-bg)',
                  color: 'var(--tint-skill-icon)',
                }}
              >
                <BrainCircuit className="h-6 w-6" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] mb-2 tracking-tight">
                Skill Gap Analyzer
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl mb-6">
                Compare your profile against job requirements to see what you need to learn.
              </p>
            </div>

            {/* Subtle text link plus arrow that shifts 3-4px right on hover */}
            <div className="pt-4 border-t border-[var(--border)]/70 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">
                <span>Open tool</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Coming Soon Row (Separate row at bottom, smaller, dimmed, no buttons, Soon badge) */}
      <section aria-label="Upcoming Tools" className="pt-4 sm:pt-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--text-muted)]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Coming Soon
            </h2>
          </div>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Coming Soon 1: Application Tracker */}
          <div className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 opacity-60 hover:opacity-85 transition-opacity duration-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--tint-tracker-bg)',
                    color: 'var(--tint-tracker-icon)',
                  }}
                >
                  <Target className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                  Soon
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                Application Tracker
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Keep track of all your internships and job applications in one place.
              </p>
            </div>
          </div>

          {/* Coming Soon 2: LinkedIn Optimizer */}
          <div className="relative rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 opacity-60 hover:opacity-85 transition-opacity duration-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--tint-linkedin-bg)',
                    color: 'var(--tint-linkedin-icon)',
                  }}
                >
                  <FaLinkedin className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[var(--surface-muted)] text-[var(--text-muted)] border border-[var(--border)]">
                  Soon
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text)] mb-1">
                LinkedIn Optimizer
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Get actionable suggestions to make your LinkedIn profile stand out to recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
