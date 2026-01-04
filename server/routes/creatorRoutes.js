import express from 'express';
import {
    getMyProblems,
    createProblemDraft,
    updateProblemDraft,
    submitForReview,
    reviewProblem
} from '../controllers/creatorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Creator routes
router.route('/problems')
    .get(getMyProblems)
    .post(createProblemDraft);

router.route('/problems/:id')
    .put(updateProblemDraft);

router.patch('/problems/:id/submit', submitForReview);

// Admin review route
router.post('/problems/:id/review', authorize('admin'), reviewProblem);

export default router;
