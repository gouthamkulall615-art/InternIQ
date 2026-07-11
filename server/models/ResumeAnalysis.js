import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  fileName: String,
  extractedText: String,
  atsScore: Number,
  scoreReasoning: String,
  improvements: [
    {
      area: String,
      issue: String,
      suggestion: String,
    },
  ],
  extractedSkills: [String],
  analyzedAt: { type: Date, default: Date.now },
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
