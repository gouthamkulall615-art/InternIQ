import express from 'express';
import { 
  getResumes, 
  getResumeById, 
  createResume, 
  updateResume, 
  deleteResume, 
  reviewResume 
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getResumes)
  .post(protect, createResume);

router.post('/review', protect, reviewResume); // Custom route for AI Review

router.route('/:id')
  .get(protect, getResumeById)
  .put(protect, updateResume)
  .delete(protect, deleteResume);

export default router;