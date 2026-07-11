import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  FileSearch,
  ArrowRight,
} from 'lucide-react';
import api from '../../lib/axios';
import { supabase } from '../../lib/supabase';
import roleSkills from '../../data/roleSkills';

// ─── Auth token helper (mirrors the one in resume-analyzer) ─────────
async function getAuthToken() {
  const customToken = localStorage.getItem('token');
  if (customToken) return customToken;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// ─── Case-insensitive skill matching ────────────────────────────────
function normalizeSkill(s) {
  return s.toLowerCase().trim();
}

function matchSkills(userSkills, requiredSkills) {
  const userSet = new Set(userSkills.map(normalizeSkill));

  const matched = [];
  const missing = [];

  for (const skill of requiredSkills) {
    if (userSet.has(normalizeSkill(skill))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  return { matched, missing };
}

// ─── Skill chip component ───────────────────────────────────────────
function SkillChip({ label, variant = 'neutral' }) {
  const styles = {
    matched:
      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
    missing:
      'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
    neutral:
      'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${styles[variant]}`}
    >
      {variant === 'matched' && (
        <CheckCircle2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
      )}
      {variant === 'missing' && (
        <XCircle className="h-3 w-3 mr-1.5 flex-shrink-0" />
      )}
      {label}
    </span>
  );
}

// ─── Main component ─────────────────────────────────────────────────
export default function SkillGapAnalyzer() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userSkills, setUserSkills] = useState([]);
  const [analyzedAt, setAnalyzedAt] = useState(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  const [selectedRole, setSelectedRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const roles = Object.keys(roleSkills);

  // ─── Fetch latest analysis on mount ─────────────────────────────
  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const token = await getAuthToken();
        const res = await api.get('/api/analyzer/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSkills(res.data.extractedSkills || []);
        setAnalyzedAt(res.data.analyzedAt);
        setHasAnalysis(true);
      } catch (err) {
        if (err.response?.status === 404) {
          setHasAnalysis(false);
        } else {
          setError('Failed to load your resume data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, []);

  // Compute gap analysis when role changes
  const analysis =
    selectedRole && hasAnalysis
      ? matchSkills(userSkills, roleSkills[selectedRole])
      : null;

  // ─── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 text-[#0A66C2] animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your skill data…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15">
            <BrainCircuit className="h-5 w-5 text-[#0A66C2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Skill Gap Analyzer
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 ml-[52px]">
          Compare your resume skills against target roles to find exactly
          what you need to learn.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* ── No analysis yet ──────────────────────────────────────── */}
      {!hasAnalysis && !error && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 sm:p-14 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 mb-6">
            <FileSearch className="h-8 w-8 text-[#0A66C2]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No resume analyzed yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Analyze your resume first to get personalized skill gap insights.
            We'll extract your skills automatically.
          </p>
          <Link
            to="/resume-analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0A66C2] rounded-xl hover:bg-[#004182] transition-colors"
          >
            <FileSearch className="h-4 w-4" />
            Analyze Your Resume
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* ── Has analysis ─────────────────────────────────────────── */}
      {hasAnalysis && (
        <div className="space-y-6">
          {/* Your Skills card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0A66C2]" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Your Skills
                </h2>
                <span className="ml-1 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {userSkills.length}
                </span>
              </div>
              {analyzedAt && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  from{' '}
                  {new Date(analyzedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill) => (
                <SkillChip key={skill} label={skill} variant="neutral" />
              ))}
              {userSkills.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                  No skills were extracted. Try analyzing a more detailed
                  resume.
                </p>
              )}
            </div>
          </div>

          {/* Role selector */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Select Target Role
            </h2>

            {/* Custom dropdown */}
            <div className="relative max-w-md">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-left transition-colors hover:border-[#0A66C2]/50 dark:hover:border-[#0A66C2]/50"
              >
                <span
                  className={
                    selectedRole
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-400 dark:text-gray-500'
                  }
                >
                  {selectedRole || 'Choose a target role…'}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute z-40 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto">
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setSelectedRole(role);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          selectedRole === role
                            ? 'text-[#0A66C2] bg-blue-50 dark:bg-[#0A66C2]/10 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Gap results ─────────────────────────────────────── */}
          {analysis && (
            <div className="space-y-6">
              {/* Summary bar */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      Gap Analysis: {selectedRole}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You have{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {analysis.matched.length}
                      </span>{' '}
                      of{' '}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {analysis.matched.length + analysis.missing.length}
                      </span>{' '}
                      required skills
                      {analysis.missing.length > 0 && (
                        <>
                          {' '}
                          —{' '}
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {analysis.missing.length} to learn
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  {/* Progress ring */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16">
                      <svg
                        className="transform -rotate-90"
                        width="64"
                        height="64"
                      >
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke="currentColor"
                          className="text-gray-200 dark:text-gray-800"
                          strokeWidth="6"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="26"
                          fill="none"
                          stroke={
                            analysis.missing.length === 0
                              ? '#22c55e'
                              : '#0A66C2'
                          }
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={
                            2 *
                            Math.PI *
                            26 *
                            (1 -
                              analysis.matched.length /
                                (analysis.matched.length +
                                  analysis.missing.length))
                          }
                          style={{
                            transition: 'stroke-dashoffset 0.6s ease-out',
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {Math.round(
                            (analysis.matched.length /
                              (analysis.matched.length +
                                analysis.missing.length)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matched skills */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Matched Skills
                  </h3>
                  <span className="ml-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                    {analysis.matched.length}
                  </span>
                </div>
                {analysis.matched.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.matched.map((skill) => (
                      <SkillChip
                        key={skill}
                        label={skill}
                        variant="matched"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                    None of your resume skills match this role's requirements
                    yet — but that's a great starting point!
                  </p>
                )}
              </div>

              {/* Missing skills */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Skills to Learn
                  </h3>
                  <span className="ml-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                    {analysis.missing.length}
                  </span>
                </div>
                {analysis.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing.map((skill) => (
                      <SkillChip
                        key={skill}
                        label={skill}
                        variant="missing"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    🎉 You have all the skills needed for this role!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
