import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyst and career coach.
You will receive the plain text content of a resume. Analyze it thoroughly for ATS compatibility, content quality, formatting cues, keyword optimization, and overall effectiveness.

Return ONLY a valid JSON object. Do NOT wrap it in markdown code fences. Do NOT include any preamble, explanation, or trailing text. The response must be parseable by JSON.parse() directly.

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
  ]
}

Scoring guidelines:
- 1-3: Major issues — missing sections, no keywords, poor structure
- 4-5: Below average — some content but significant gaps
- 6-7: Decent — solid foundation but clear room for improvement
- 8-9: Strong — well-optimized with minor tweaks needed
- 10: Exceptional — near-perfect ATS optimization

Always return at least 3 improvements, even for strong resumes. Be specific and actionable.`;

export const analyzeResumeWithClaude = async (resumeText) => {
  if (!resumeText || resumeText.trim() === '') {
    throw new Error('Resume text content is empty or missing.');
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this resume:\n\n${resumeText}`,
        },
      ],
    });

    const text = message.content[0].text;

    // Safety: strip markdown fences if the model wraps anyway
    const clean = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error('Anthropic Service Error:', error);
    throw new Error(`Failed to analyze resume via Claude API: ${error.message}`);
  }
};
