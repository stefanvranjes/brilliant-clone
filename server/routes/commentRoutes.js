import express from 'express';
import { getComments, createComment, toggleLike } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:problemId', getComments);
router.post('/', protect, createComment);
router.post('/:id/like', protect, toggleLike);

export default router;
