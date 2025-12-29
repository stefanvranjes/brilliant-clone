import express from 'express';
import { askAi } from '../services/aiService.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Ask the AI tutor for help
// @route   POST /api/ai/ask
// @access  Private
router.post('/ask', protect, async (req, res, next) => {
    try {
        const { question, context } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Question is required' });
        }

        const aiResponse = await askAi(question, context || {});
        res.status(200).json(aiResponse);
    } catch (error) {
        next(error);
    }
});

export default router;
