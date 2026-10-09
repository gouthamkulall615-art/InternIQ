import express from 'express';
import { analyzeResume, getLatestAnalysis, generateCoverLetter } from '../controllers/analyzerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', protect, analyzeResume);
router.get('/latest', protect, getLatestAnalysis);
router.post('/generate-cover-letter', protect, generateCoverLetter);

export default router;
