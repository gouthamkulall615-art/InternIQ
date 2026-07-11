import { analyzeResumeWithGemini } from '../services/geminiService.js';
import ResumeAnalysis from '../models/ResumeAnalysis.js';

export const analyzeResume = async (req, res) => {
  const { resumeText, fileName } = req.body;

  console.log('[Analyzer] POST /api/analyzer/analyze — request received');

  if (!resumeText || resumeText.trim() === '') {
    return res.status(400).json({ error: 'No resume text provided.' });
  }

  try {
    const result = await analyzeResumeWithGemini(resumeText);

    // Persist to MongoDB — upsert so each user has exactly one analysis doc
    try {
      await ResumeAnalysis.findOneAndUpdate(
        { userId: req.user.id },
        {
          userId: req.user.id,
          fileName: fileName || 'resume',
          extractedText: resumeText,
          atsScore: result.ats_score,
          scoreReasoning: result.score_reasoning,
          improvements: result.improvements,
          extractedSkills: result.extracted_skills || [],
          analyzedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      console.log('[Analyzer] Analysis saved to MongoDB for user:', req.user.id);
    } catch (dbError) {
      // Log but don't fail the request — the user still gets their analysis
      console.error('[Analyzer] MongoDB save error (non-fatal):', dbError.message);
    }

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

export const getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({ userId: req.user.id })
      .sort({ analyzedAt: -1 })
      .lean();

    if (!analysis) {
      return res.status(404).json({ message: 'No resume analyzed yet' });
    }

    res.json({
      extractedSkills: analysis.extractedSkills,
      analyzedAt: analysis.analyzedAt,
    });
  } catch (error) {
    console.error('[Analyzer] getLatestAnalysis error:', error.message);
    res.status(500).json({ error: 'Failed to fetch analysis data.' });
  }
};
