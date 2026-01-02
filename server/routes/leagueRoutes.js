import express from 'express';
import { getLeagueStatus, resetLeagues } from '../controllers/leagueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/status', protect, getLeagueStatus);
router.post('/reset', protect, resetLeagues);

export default router;
