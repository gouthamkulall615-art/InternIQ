import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResumeText = async (resumeText) => {
  if (!resumeText || resumeText.trim() === "") {
    throw new Error("Resume text content is empty or missing.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze the following resume and return a JSON object only, no markdown, no explanation. 
    Return exactly this structure:
    {
      "score": (number out of 10),
      "strengths": [array of strings],
      "weaknesses": [array of strings],
      "missingSkills": [array of strings],
      "suggestions": [array of strings]
    }
    
    Resume:
    ${resumeText}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Strip markdown code blocks if Gemini wraps it
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error(
      `Failed to analyze resume via Gemini API: ${error.message}`,
    );
  }
};
