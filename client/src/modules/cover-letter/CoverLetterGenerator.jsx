import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSignature,
  Loader2,
  AlertCircle,
  FileSearch,
  ArrowRight,
  Sparkles,
  Download,
  RotateCcw,
  X,
} from 'lucide-react';
import api from '../../lib/axios';
import { generateCoverLetterPDF } from '../../utils/generateReportPDF';

// ─── Auth token helper ──────────────────────────────────────────────
async function getAuthToken() {
  const customToken = localStorage.getItem('token');
  if (customToken) return customToken;
  throw new Error('Please sign in to continue.');
}

// ─── Main component ─────────────────────────────────────────────────
export default function CoverLetterGenerator() {
  // Resume check state
  const [checkingResume, setCheckingResume] = useState(true);
  const [hasResume, setHasResume] = useState(false);

  // Form state
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');

  // Generation state
  const [status, setStatus] = useState('idle'); // idle | generating | done | error
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');

  const resultRef = useRef(null);

  // ─── Check for existing resume analysis on mount ────────────────
  useEffect(() => {
    async function checkResume() {
      try {
        const token = await getAuthToken();
        await api.get('/api/analyzer/latest', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasResume(true);
      } catch (err) {
        if (err.response?.status === 404) {
          setHasResume(false);
        } else {
          setError('Failed to check your resume data. Please try again.');
        }
      } finally {
        setCheckingResume(false);
      }
    }
    checkResume();
  }, []);

  // ─── Generate cover letter ─────────────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('generating');
    setCoverLetter('');

    try {
      const token = await getAuthToken();
      const res = await api.post(
        '/api/analyzer/generate-cover-letter',
        { jobDescription, companyName, roleTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoverLetter(res.data.coverLetter);
      setStatus('done');

      // Scroll to result after a tick
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
      setStatus('error');
    }
  };

  // ─── Reset form for another generation ──────────────────────────
  const handleReset = () => {
    setJobDescription('');
    setCompanyName('');
    setRoleTitle('');
    setCoverLetter('');
    setStatus('idle');
    setError('');
  };

  const isGenerating = status === 'generating';

  // ─── Loading (checking resume) ──────────────────────────────────
  if (checkingResume) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 text-[#0A66C2] animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading…
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
            <FileSignature className="h-5 w-5 text-[#0A66C2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Cover Letter Generator
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 ml-[52px]">
          Generate a tailored cover letter using your resume and a job description.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Generation failed</p>
            <p className="mt-1 text-red-600 dark:text-red-400/80">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── No resume yet ─────────────────────────────────────────── */}
      {!hasResume && !error && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 sm:p-14 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 mb-6">
            <FileSearch className="h-8 w-8 text-[#0A66C2]" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upload your resume first
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Head to the Resume Analyzer to upload your resume, then come back here to
            generate tailored cover letters.
          </p>
          <Link
            to="/resume-analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0A66C2] rounded-xl hover:bg-[#004182] transition-colors"
          >
            <FileSearch className="h-4 w-4" />
            Go to Resume Analyzer
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* ── Has resume — show form / results ──────────────────────── */}
      {hasResume && (
        <div className="space-y-6">
          {/* Input form card */}
          {status !== 'done' && (
            <form
              onSubmit={handleGenerate}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                Job Details
              </h2>

              {/* Job Description */}
              <div className="mb-5">
                <label
                  htmlFor="coverLetterJobDesc"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="coverLetterJobDesc"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                  disabled={isGenerating}
                  rows={8}
                  placeholder="Paste the job description here..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2] resize-y disabled:opacity-50"
                />
              </div>

              {/* Company Name & Role Title — side by side on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="coverLetterCompany"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Company Name <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="coverLetterCompany"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isGenerating}
                    placeholder="e.g. Google"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2] disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="coverLetterRole"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Role Title <span className="text-xs text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="coverLetterRole"
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    disabled={isGenerating}
                    placeholder="e.g. Frontend Engineer Intern"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Generate button */}
              <button
                type="submit"
                disabled={isGenerating || !jobDescription.trim()}
                className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl min-h-[44px] transition-colors ${
                  isGenerating || !jobDescription.trim()
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'text-white bg-[#0A66C2] hover:bg-[#004182]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </form>
          )}

          {/* Loading state */}
          {isGenerating && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 sm:p-14">
              <div className="flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-[#0A66C2] animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Crafting your cover letter…
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gemini is tailoring it to the job description
                  </p>
                </div>

                {/* Skeleton bars */}
                <div className="w-full max-w-sm space-y-3 mt-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-4/5" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-3/5" />
                </div>
              </div>
            </div>
          )}

          {/* ── Result (editable) ──────────────────────────────────── */}
          {status === 'done' && coverLetter && (
            <div ref={resultRef} className="space-y-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileSignature className="h-5 w-5 text-[#0A66C2]" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Your Cover Letter
                  </h2>
                  <span className="ml-1 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    Editable
                  </span>
                </div>

                <textarea
                  id="coverLetterResult"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={16}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white leading-relaxed transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2] resize-y"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => generateCoverLetterPDF(coverLetter)}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#0A66C2] rounded-xl hover:bg-[#004182] transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download as PDF
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-[#0A66C2] border border-[#0A66C2]/30 rounded-xl hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Generate Another
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
