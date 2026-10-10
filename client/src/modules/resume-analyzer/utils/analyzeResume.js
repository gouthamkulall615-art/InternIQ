import api from '../../../lib/axios';

/**
 * Get the best available auth token.
 * Prefers the custom JWT from localStorage.
 */
async function getAuthToken() {
  const customToken = localStorage.getItem('token');
  if (customToken) return customToken;
  throw new Error('Please sign in to analyze your resume.');
}

/**
 * Send extracted resume text to the server for Gemini AI analysis.
 * Automatically resolves the correct auth token.
 */
export async function analyzeResume(resumeText, fileName) {
  try {
    const token = await getAuthToken();

    const response = await api.post(
      '/api/analyzer/analyze',
      { resumeText, fileName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Analysis failed. Please try again.';
    throw new Error(message);
  }
}
