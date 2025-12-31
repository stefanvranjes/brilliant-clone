import express from 'express';
import { getUserProgress, solveProblem, updateUser, getLeaderboard, getPublicProfile, purchaseItem } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/profile/:id', getPublicProfile);
router.get('/me', protect, getUserProgress);
router.post('/solve', protect, solveProblem);
router.put('/profile', protect, updateUser);
router.post('/purchase', protect, purchaseItem);

export default router;
