import { useState } from 'react';
import axios from 'axios';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function AiReviewModal({ resumeData, onClose }) {
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleReview = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/resumes/review', {
        resumeData,
        jobDescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to get AI review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-4 text-base rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent transition-colors min-h-[44px]";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 sm:rounded-xl shadow-xl w-full sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden transition-colors rounded-t-xl sm:rounded-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AI Resume Review</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!feedback && !loading && (
            <div className="space-y-4 max-w-lg mx-auto mt-4 sm:mt-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to review your resume?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Optionally paste a job description below to get tailored feedback and keyword match analysis.</p>
              </div>
              <textarea
                className={`${inputClass} h-40 resize-y`}
                placeholder="Paste Job Description here (optional)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <button
                onClick={handleReview}
                className="w-full py-3 px-4 bg-[#0A66C2] text-white font-semibold rounded-lg hover:bg-[#004182] transition-colors min-h-[44px]"
              >
                Start AI Review
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-[#0A66C2] animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse text-sm text-center">Analyzing your resume against industry standards…</p>
            </div>
          )}

          {feedback && !loading && (
            <div className="space-y-6 sm:space-y-8">
              {/* Score Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 dark:bg-gray-800/30 p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-gray-200 dark:text-gray-700" strokeWidth="3" stroke="currentColor" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path
                      className={feedback.ats_score > 75 ? 'text-emerald-500' : feedback.ats_score > 50 ? 'text-amber-500' : 'text-red-500'}
                      strokeWidth="3" strokeDasharray={`${feedback.ats_score}, 100`} stroke="currentColor" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{feedback.ats_score}</span>
                    <span className="text-xs text-gray-400">/ 100</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">ATS Compatibility Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feedback.ats_score_reasoning}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 italic">"{feedback.summary_review}"</p>
                </div>
              </div>

              {/* Strengths & Drawbacks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-900/30 p-4 sm:p-5 rounded-xl">
                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 flex items-center mb-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Strengths
                  </h4>
                  <ul className="space-y-2">
                    {feedback.strengths?.map((str, i) => (
                      <li key={i} className="text-sm text-emerald-900 dark:text-emerald-300 flex items-start">
                        <span className="mr-2 mt-0.5 flex-shrink-0">•</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-900/30 p-4 sm:p-5 rounded-xl">
                  <h4 className="font-semibold text-red-800 dark:text-red-400 flex items-center mb-3 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {feedback.drawbacks?.map((draw, i) => (
                      <li key={i} className="text-sm text-red-900 dark:text-red-300 flex items-start">
                        <span className="mr-2 mt-0.5 flex-shrink-0">•</span> {draw}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keywords */}
              {jobDescription && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2 text-sm">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {feedback.keyword_matches?.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs rounded-md font-medium">{kw}</span>
                      ))}
                      {(!feedback.keyword_matches || feedback.keyword_matches.length === 0) && (
                        <span className="text-sm text-gray-400">No matches found.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2 text-sm">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {feedback.missing_keywords?.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded-md font-medium">{kw}</span>
                      ))}
                      {(!feedback.missing_keywords || feedback.missing_keywords.length === 0) && (
                        <span className="text-sm text-gray-400">No missing keywords found.</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              <div>
                <h4 className="font-semibold text-[#0A66C2] dark:text-[#3B82F6] flex items-center mb-3 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" /> Actionable Next Steps
                </h4>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl divide-y divide-gray-100 dark:divide-gray-800">
                  {feedback.actionable_suggestions?.map((sug, i) => (
                    <div key={i} className="p-3 sm:p-4 text-sm text-gray-700 dark:text-gray-300">{sug}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {feedback && !loading && (
          <div className="border-t border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 flex justify-end">
            <button
              onClick={() => { setFeedback(null); setJobDescription(''); }}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
            >
              Re-run Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
