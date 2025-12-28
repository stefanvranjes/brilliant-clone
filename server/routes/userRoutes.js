import express from 'express';
import { getUserProgress, solveProblem, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getUserProgress);
router.post('/solve', protect, solveProblem);
router.put('/profile', protect, updateUser);

export default router;
