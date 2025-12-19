import express from 'express';
import { getProblems, getProblemById, checkAnswer } from '../controllers/problemController.js';

const router = express.Router();

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/:id/check', checkAnswer);

export default router;
