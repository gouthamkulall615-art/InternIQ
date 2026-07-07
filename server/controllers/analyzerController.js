import { analyzeResumeWithGemini } from '../services/geminiService.js';

export const analyzeResume = async (req, res) => {
  const { resumeText } = req.body;

  console.log('[Analyzer] POST /api/analyzer/analyze — request received');

  if (!resumeText || resumeText.trim() === '') {
    return res.status(400).json({ message: 'No resume text provided.' });
  }

  try {
    const result = await analyzeResumeWithGemini(resumeText);
    res.json(result);
  } catch (error) {
    console.error('[Analyzer] Controller Error:', error.message);
    res.status(500).json({ message: error.message || 'Analysis failed. Please try again.' });
  }
};
