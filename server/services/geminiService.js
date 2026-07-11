import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const PROMPT_PREFIX = `You are an expert ATS (Applicant Tracking System) resume analyst and career coach.
You will receive the plain text content of a resume. Analyze it thoroughly for ATS compatibility, content quality, formatting cues, keyword optimization, and overall effectiveness.

Return ONLY valid JSON. Do not include markdown code fences, do not include any explanation text before or after the JSON.

Use this exact schema:
{
  "ats_score": <number from 1 to 10>,
  "score_reasoning": "<1-2 sentence explanation of why you gave this score>",
  "improvements": [
    {
      "area": "<category, e.g. Keywords, Formatting, Structure, Clarity, Impact Metrics, Contact Info, Skills Section, Experience Descriptions>",
      "issue": "<specific problem found>",
      "suggestion": "<actionable fix>"
    }
  ],
  "extracted_skills": ["<skill1>", "<skill2>", "..."]
}

The "extracted_skills" array should list every concrete skill, technology, tool, framework, language, and methodology mentioned anywhere in the resume — as short, recognizable labels (e.g. "React", "Python", "Docker", "REST APIs", "Git", "A/B Testing"). Include both hard and soft skills. De-duplicate and keep names concise.

Scoring guidelines:
- 1-3: Major issues — missing sections, no keywords, poor structure
- 4-5: Below average — some content but significant gaps
- 6-7: Decent — solid foundation but clear room for improvement
- 8-9: Strong — well-optimized with minor tweaks needed
- 10: Exceptional — near-perfect ATS optimization

Always return at least 3 improvements, even for strong resumes. Be specific and actionable.`;

// ─── Retry helper with exponential backoff ────────────────────────
async function callGeminiWithRetry(geminiModel, prompt, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await geminiModel.generateContent(prompt);
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

  const prompt = `${PROMPT_PREFIX}\n\nAnalyze this resume:\n\n${resumeText}`;
  console.log('[Gemini] Request received — sending prompt to model...');

  // Use the retry-aware wrapper instead of calling model.generateContent directly
  const responseText = await callGeminiWithRetry(model, prompt);

  console.log('[Gemini] Raw response:', responseText);

  // Defensively strip markdown fences in case the model wraps the JSON
  const cleaned = responseText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  console.log('[Gemini] Parsed successfully:', JSON.stringify(parsed, null, 2));

  return parsed;
};
