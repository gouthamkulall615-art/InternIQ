import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake-key');

export const reviewResumeWithAI = async (resumeData, jobDescription = '') => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' }); // Using a solid model for JSON structure

  const prompt = `
    You are an expert technical recruiter and ATS (Applicant Tracking System) specialist. 
    You will be given the data of a resume, and optionally a target job description. 
    Evaluate the resume strictly and honestly. 
    Return ONLY a valid JSON object (no markdown, no preamble) with these exact keys: 
    - ats_score (number 0-100)
    - ats_score_reasoning (string)
    - summary_review (string, 2-3 sentences)
    - strengths (array of strings)
    - drawbacks (array of strings)
    - formatting_issues (array of strings)
    - keyword_matches (array of strings)
    - missing_keywords (array of strings)
    - section_feedback (object with string keys: summary, experience, skills, education)
    - actionable_suggestions (array of strings)
    
    Job Description: ${jobDescription || 'None provided'}
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting if model still adds it
    const cleanText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error generating AI review:', error);
    throw new Error('Failed to generate AI review');
  }
};
