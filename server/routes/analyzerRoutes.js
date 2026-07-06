import express from 'express';
import { analyzeResume } from '../controllers/analyzerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', protect, analyzeResume);

export default router;
