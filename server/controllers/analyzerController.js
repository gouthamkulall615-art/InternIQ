import { analyzeResumeWithGemini } from '../services/geminiService.js';

export const analyzeResume = async (req, res) => {
  const { resumeText } = req.body;

  console.log('[Analyzer] POST /api/analyzer/analyze — request received');

  if (!resumeText || resumeText.trim() === '') {
    return res.status(400).json({ error: 'No resume text provided.' });
  }

  try {
    const result = await analyzeResumeWithGemini(resumeText);
    res.json(result);
  } catch (error) {
    console.error('[Analyzer] Controller Error:', error.message);

    const status = error?.status || error?.response?.status;

    if (status === 429) {
      return res.status(429).json({
        error:
          'Our AI service is experiencing high demand right now. Please try again in a minute.',
      });
    }

    if (status === 503) {
      return res.status(503).json({
        error:
          'The analysis service is temporarily unavailable. Please try again shortly.',
      });
    }

    res.status(500).json({
      error:
        'Something went wrong analyzing your resume. Please try again.',
    });
  }
};
