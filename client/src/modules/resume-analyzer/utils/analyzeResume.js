import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analyzer';

/**
 * Send extracted resume text to the server for Claude AI analysis.
 * Requires a valid JWT token for the protected endpoint.
 */
export async function analyzeResume(resumeText, token) {
  try {
    const response = await axios.post(
      `${API_URL}/analyze`,
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
