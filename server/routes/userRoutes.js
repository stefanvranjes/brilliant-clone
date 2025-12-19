import express from 'express';
import { getUserProgress, solveProblem, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', getUserProgress);
router.post('/:id/solve', solveProblem);
router.put('/:id', updateUser);

export default router;
