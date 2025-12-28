import express from 'express';
import { getUserProgress, solveProblem, updateUser, getLeaderboard } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/me', protect, getUserProgress);
router.post('/solve', protect, solveProblem);
router.put('/profile', protect, updateUser);

export default router;
