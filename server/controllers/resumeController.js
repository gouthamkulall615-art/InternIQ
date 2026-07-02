import Resume from '../models/Resume.js';
import { reviewResumeWithAI } from '../services/aiService.js';

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.user.toString() === req.user._id.toString()) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createResume = async (req, res) => {
  const { title, data } = req.body;
  try {
    const resume = new Resume({
      user: req.user._id,
      title: title || 'Untitled Resume',
      data: data || {},
    });
    const createdResume = await resume.save();
    res.status(201).json(createdResume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  const { title, data } = req.body;
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.user.toString() === req.user._id.toString()) {
      resume.title = title || resume.title;
      resume.data = data || resume.data;
      const updatedResume = await resume.save();
      res.json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.user.toString() === req.user._id.toString()) {
      await resume.deleteOne();
      res.json({ message: 'Resume removed' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewResume = async (req, res) => {
  const { resumeData, jobDescription } = req.body;
  
  if (!resumeData) {
    return res.status(400).json({ message: 'No resume data provided' });
  }

  try {
    const reviewResult = await reviewResumeWithAI(resumeData, jobDescription);
    res.json(reviewResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};