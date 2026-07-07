import api from '../../../lib/axios';
import { supabase } from '../../../lib/supabase';

/**
 * Get the best available auth token.
 * Prefers the custom JWT from localStorage; falls back to the
 * Supabase session access_token (Google login flow).
 */
async function getAuthToken() {
  const customToken = localStorage.getItem('token');
  if (customToken) return customToken;

  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Send extracted resume text to the server for Gemini AI analysis.
 * Automatically resolves the correct auth token (custom JWT or Supabase).
 */
export async function analyzeResume(resumeText) {
  try {
    const token = await getAuthToken();

    const response = await api.post(
      '/api/analyzer/analyze',
      { resumeText },
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
      error.response?.data?.message ||
      error.message ||
      'Analysis failed. Please try again.';
    throw new Error(message);
  }
}
