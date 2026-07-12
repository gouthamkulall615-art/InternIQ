import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Model with structured output + low temperature ─────────────────
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.2,
    topP: 0.8,
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      properties: {
        ats_score: { type: 'number' },
        score_reasoning: { type: 'string' },
        extracted_skills: { type: 'array', items: { type: 'string' } },
        improvements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              area: { type: 'string' },
              issue: { type: 'string' },
              suggestion: { type: 'string' },
            },
            required: ['area', 'issue', 'suggestion'],
          },
        },
      },
      required: ['ats_score', 'score_reasoning', 'extracted_skills', 'improvements'],
    },
  },
});

// ─── Explicit scoring rubric prompt ─────────────────────────────────
function buildPrompt(resumeText) {
  return `You are an expert ATS (Applicant Tracking System) resume reviewer.
Score the following resume using this EXACT rubric, out of 10 total points:

- Formatting & ATS-readability (0-2 points): single-column layout, standard section headers, no tables/graphics/columns that break ATS parsing
- Keyword relevance (0-2 points): presence of relevant technical/role-specific keywords
- Experience quality (0-2 points): action verbs, quantifiable achievements/metrics
- Structure & completeness (0-2 points): presence of standard sections (Summary, Experience, Education, Skills), logical order
- Clarity & professionalism (0-2 points): concise language, no vague filler, professional tone, correct dates/no future dates for completed work

Sum these five sub-scores for the final ats_score out of 10. Be consistent: apply the SAME standard every time regardless of the resume's field or seniority level.

The "extracted_skills" array should list every concrete skill, technology, tool, framework, language, and methodology mentioned anywhere in the resume — as short, recognizable labels (e.g. "React", "Python", "Docker", "REST APIs", "Git", "A/B Testing"). Include both hard and soft skills. De-duplicate and keep names concise.

Always return at least 3 improvements, even for strong resumes. Be specific and actionable.

Resume text:
"""
${resumeText}
"""

Return your analysis in the required JSON structure.`;
}

// ─── Retry helper with exponential backoff ────────────────────────
async function callGeminiWithRetry(geminiModel, prompt, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      return result.response.text();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const isRetryable = status === 503 || status === 429;
      const isLastAttempt = attempt === maxRetries;

      if (isRetryable && !isLastAttempt) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 8000); // 1s, 2s, 4s, capped at 8s
        console.log(
          `[Gemini] Call failed (${status}), retrying in ${delay}ms… (attempt ${attempt + 1}/${maxRetries})`
        );
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }
      throw err; // not retryable, or out of retries — bubble up
    }
  }
}

export const analyzeResumeWithGemini = async (resumeText) => {
  if (!resumeText || resumeText.trim() === '') {
    throw new Error('Resume text content is empty or missing.');
  }

  const prompt = buildPrompt(resumeText);
  console.log('[Gemini] Request received — sending prompt to model...');

  // Use the retry-aware wrapper
  const responseText = await callGeminiWithRetry(model, prompt);

  console.log('[Gemini] Raw response:', responseText);

  // Structured output guarantees valid JSON — no regex cleanup needed
  const parsed = JSON.parse(responseText);

  console.log('[Gemini] Parsed successfully:', JSON.stringify(parsed, null, 2));

  return parsed;
};

