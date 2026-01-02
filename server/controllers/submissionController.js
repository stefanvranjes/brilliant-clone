import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';

// @desc    Submit a "Show Your Work" solution
// @route   POST /api/submissions
// @access  Private
export const createSubmission = async (req, res, next) => {
    try {
        const { problemId, content } = req.body;
        const userId = req.user._id;

        const submission = await Submission.create({
            userId,
            problemId,
            content
        });

        // Trigger AI Critique (Mocked for now)
        // In a real scenario, this would call an LLM API
        const mockCritique = {
            logicGrade: 'good',
            feedback: 'Your approach to the problem is sound, especially how you handled the base case. However, your recursive step could be more efficient.',
            suggestions: [
                'Consider memoization to optimize the recursive calls.',
                'Refine your variable naming for better clarity.'
            ]
        };

        submission.aiCritique = mockCritique;
        submission.status = 'critiqued';
        await submission.save();

        res.status(201).json(submission);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's submissions
// @route   GET /api/submissions
// @access  Private
export const getUserSubmissions = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ userId: req.user._id })
            .populate('problemId', 'title category')
            .sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        next(error);
    }
};
