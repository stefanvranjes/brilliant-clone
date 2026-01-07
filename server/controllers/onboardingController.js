import User from '../models/User.js';
import Problem from '../models/Problem.js';

// @desc    Get set of diagnostic problems
// @route   GET /api/onboarding/diagnostic
// @access  Private
export const getDiagnosticSet = async (req, res, next) => {
    try {
        const categories = ['Logic', 'Math', 'Computer Science', 'Science'];
        const diagnosticProblems = [];

        for (const category of categories) {
            const problem = await Problem.findOne({ category, status: 'published' }).select('-solution');
            if (problem) diagnosticProblems.push(problem);
        }

        // Add one more random one or from a popular category
        const randomProblem = await Problem.findOne({
            category: { $in: categories },
            _id: { $nin: diagnosticProblems.map(p => p._id) },
            status: 'published'
        }).select('-solution');

        if (randomProblem) diagnosticProblems.push(randomProblem);

        res.status(200).json({
            success: true,
            data: diagnosticProblems
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Finish diagnostic and update user history
// @route   POST /api/onboarding/finish
// @access  Private
export const finishDiagnostic = async (req, res, next) => {
    try {
        const { results } = req.body; // Array of { problemId, isCorrect, timeSpent }
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const newHistory = [];
        let earnedXP = 0;

        for (const result of results) {
            if (result.isCorrect) {
                const problem = await Problem.findById(result.problemId);
                if (problem) {
                    newHistory.push({
                        problemId: problem._id,
                        xpEarned: problem.xpReward || 50,
                        completedAt: new Date()
                    });
                    earnedXP += (problem.xpReward || 50);
                }
            } else {
                // Register as failed attempt
                user.failedAttempts.push({
                    problemId: result.problemId,
                    lastFailed: new Date()
                });
            }
        }

        user.history.push(...newHistory);
        user.totalXP += earnedXP;
        user.problemsSolved += newHistory.length;
        user.isOnboarded = true;

        user.calculateLevel();
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                xpEarned: earnedXP,
                solvedCount: newHistory.length
            }
        });
    } catch (error) {
        next(error);
    }
};
