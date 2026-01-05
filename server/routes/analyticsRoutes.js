import express from 'express';
import { getMasteryStats, getRecommendations } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mastery', protect, getMasteryStats);
router.get('/recommendations', protect, getRecommendations);

export default router;
