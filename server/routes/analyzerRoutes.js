import express from 'express';
import { analyzeResume, getLatestAnalysis } from '../controllers/analyzerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', protect, analyzeResume);
router.get('/latest', protect, getLatestAnalysis);

export default router;
