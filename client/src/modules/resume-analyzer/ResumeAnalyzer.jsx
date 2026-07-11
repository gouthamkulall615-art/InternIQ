import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  FileSearch,
  FileText,
  FileType2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { extractResumeText } from './utils/parseResume';
import { analyzeResume } from './utils/analyzeResume';
import { useAuth } from '../../contexts/AuthContext';

// ─── Score ring colors ──────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 8) return { ring: '#22c55e', bg: 'rgba(34,197,94,0.10)', label: 'Excellent' };
  if (score >= 6) return { ring: '#0A66C2', bg: 'rgba(10,102,194,0.10)', label: 'Good' };
  if (score >= 4) return { ring: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'Needs Work' };
  return { ring: '#ef4444', bg: 'rgba(239,68,68,0.10)', label: 'Poor' };
}

// ─── Area icon mapping ──────────────────────────────────────────────
function areaIcon(area) {
  const lower = area.toLowerCase();
  if (lower.includes('keyword')) return '🔑';
  if (lower.includes('format')) return '📐';
  if (lower.includes('structure')) return '🏗️';
  if (lower.includes('clarity')) return '✍️';
  if (lower.includes('impact') || lower.includes('metric')) return '📊';
  if (lower.includes('contact')) return '📇';
  if (lower.includes('skill')) return '🛠️';
  if (lower.includes('experience')) return '💼';
  if (lower.includes('education')) return '🎓';
  if (lower.includes('summary') || lower.includes('objective')) return '📝';
  return '💡';
}

// ─── Circular score gauge (SVG) ─────────────────────────────────────
function ScoreGauge({ score }) {
  const { ring, bg, label } = scoreColor(score);
  const radius = 70;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg width="180" height="180" className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-800"
            strokeWidth={stroke}
          />
          {/* Score arc */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke={ring}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-gray-900 dark:text-white leading-none">
            {score}
          </span>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">/ 10</span>
        </div>
      </div>
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: bg, color: ring }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Single improvement card ────────────────────────────────────────
function ImprovementCard({ item, index }) {
  const [open, setOpen] = useState(index < 3); // first 3 expanded by default

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-all duration-200 hover:border-[#0A66C2]/30 dark:hover:border-[#0A66C2]/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <span className="text-xl flex-shrink-0">{areaIcon(item.area)}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.area}</span>
          {!open && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {item.issue}
            </p>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-0 space-y-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
              Issue
            </span>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
              {item.issue}
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Suggestion
            </span>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
              {item.suggestion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page component ────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | extracting | analyzing | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds remaining

  const inputRef = useRef(null);

  // ─── Cooldown countdown after a failed attempt ──────────────────
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // ─── File selection ──────────────────────────────────────────────
  const handleFile = useCallback(async (selectedFile) => {
    setError('');
    setResult(null);

    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      setError(`Unsupported file type ".${ext}". Please upload a PDF or DOCX file.`);
      return;
    }

    setFile(selectedFile);
    setStatus('extracting');

    try {
      const text = await extractResumeText(selectedFile);

      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract meaningful text. The file may be image-based or empty.');
      }

      setStatus('analyzing');
      const analysis = await analyzeResume(text, selectedFile.name);
      setResult(analysis);
      setStatus('done');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
      setCooldown(5); // 5-second cooldown before allowing another attempt
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // ─── Loading / disabled state ───────────────────────────────────
  const isLoading = status === 'extracting' || status === 'analyzing';
  const isDisabled = isLoading || cooldown > 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#0A66C2]/10 dark:bg-[#0A66C2]/15">
            <FileSearch className="h-5 w-5 text-[#0A66C2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Resume Analyzer
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 ml-[52px]">
          Upload your resume and get an instant ATS compatibility score with actionable improvements.
        </p>
      </div>

      {/* ── Error banner ──────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Analysis failed</p>
            <p className="mt-1 text-red-600 dark:text-red-400/80">{error}</p>
          </div>
          <button onClick={reset} className="flex-shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Upload area (idle / error) ────────────────────────────── */}
      {(status === 'idle' || status === 'error') && (
        <div
          onDragOver={(e) => { e.preventDefault(); if (!isDisabled) setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { if (!isDisabled) handleDrop(e); else e.preventDefault(); }}
          className={`relative bg-white dark:bg-gray-900 border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center transition-all duration-200 ${
            isDisabled
              ? 'border-gray-200 dark:border-gray-800 opacity-60 cursor-not-allowed'
              : dragActive
                ? 'border-[#0A66C2] bg-blue-50/50 dark:bg-[#0A66C2]/5'
                : 'border-gray-300 dark:border-gray-700 hover:border-[#0A66C2]/50 dark:hover:border-[#0A66C2]/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            disabled={isDisabled}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div className="flex justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-red-500" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <FileType2 className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Drop your resume here
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            or click below to browse · PDF and DOCX supported
          </p>

          <button
            onClick={() => inputRef.current?.click()}
            disabled={isDisabled}
            className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl min-h-[44px] transition-colors ${
              isDisabled
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'text-white bg-[#0A66C2] hover:bg-[#004182]'
            }`}
          >
            <Upload className="h-4 w-4" />
            {cooldown > 0 ? `Please wait ${cooldown}s…` : 'Choose File'}
          </button>
        </div>
      )}

      {/* ── Loading state ─────────────────────────────────────────── */}
      {isLoading && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 sm:p-14">
          <div className="flex flex-col items-center gap-5">
            {/* Animated icon */}
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
                {status === 'extracting' ? 'Extracting text…' : 'Analyzing with AI…'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {status === 'extracting'
                  ? 'Reading your resume file'
                  : 'Gemini is evaluating ATS compatibility'}
              </p>
            </div>

            {/* File chip */}
            {file && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                  {file.name}
                </span>
              </div>
            )}

            {/* Skeleton bars */}
            <div className="w-full max-w-sm space-y-3 mt-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-4/5" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-3/5" />
            </div>
          </div>
        </div>
      )}

      {/* ── Results ───────────────────────────────────────────────── */}
      {status === 'done' && result && (
        <div className="space-y-6">
          {/* Score card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreGauge score={result.ats_score} />

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  ATS Compatibility Score
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {result.score_reasoning}
                </p>

                {/* File chip */}
                {file && (
                  <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <FileText className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] truncate">
                      {file.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Improvements header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-[#0A66C2]" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Improvement Areas
              </h2>
              <span className="ml-1 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {result.improvements?.length || 0}
              </span>
            </div>
          </div>

          {/* Improvement cards */}
          <div className="space-y-3">
            {result.improvements?.map((item, i) => (
              <ImprovementCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/skill-gap')}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#0A66C2] rounded-xl hover:bg-[#004182] transition-colors"
            >
              Check Skill Gaps
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-[#0A66C2] border border-[#0A66C2]/30 rounded-xl hover:bg-[#0A66C2]/5 dark:hover:bg-[#0A66C2]/10 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
