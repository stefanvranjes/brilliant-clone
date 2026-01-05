import User from '../models/User.js';
import Problem from '../models/Problem.js';

// @desc    Get user mastery stats
// @route   GET /api/analytics/mastery
// @access  Private
export const getMasteryStats = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('history.problemId');
        const history = user.history;
        const failedAttempts = user.failedAttempts;

        // Categories to track
        const categories = ['Logic', 'Math', 'Computer Science', 'Science', 'Daily Challenge'];
        const stats = {};

        categories.forEach(cat => {
            stats[cat] = {
                solved: 0,
                failed: 0,
                totalXP: 0
            };
        });

        // Tally solved
        history.forEach(item => {
            if (item.problemId && item.problemId.category) {
                const cat = item.problemId.category;
                if (stats[cat]) {
                    stats[cat].solved += 1;
                    stats[cat].totalXP += item.xpEarned;
                }
            }
        });

        // Tally failed (we need to populate failed attempts too or do a separate query)
        const failedProblemIds = failedAttempts.map(f => f.problemId);
        const failedProblems = await Problem.find({ _id: { $in: failedProblemIds } });

        failedProblems.forEach(p => {
            if (stats[p.category]) {
                stats[p.category].failed += 1;
            }
        });

        // Calculate mastery percentage for each category
        const masteryData = categories.map(cat => {
            const s = stats[cat];
            const totalInteractions = s.solved + s.failed;
            let score = 0;
            if (totalInteractions > 0) {
                score = Math.round((s.solved / totalInteractions) * 100);
            }
            return {
                subject: cat,
                score: score,
                fullMark: 100
            };
        });

        res.status(200).json({
            success: true,
            data: masteryData
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get recommended problems based on mastery
// @route   GET /api/analytics/recommendations
// @access  Private
export const getRecommendations = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('history.problemId');

        // 1. Find weak categories
        // (Simplified: just get mastery and sort)
        const categories = ['Logic', 'Math', 'Computer Science', 'Science'];
        const interactions = {};
        categories.forEach(c => interactions[c] = { solved: 0, total: 0 });

        user.history.forEach(item => {
            if (item.problemId && interactions[item.problemId.category]) {
                interactions[item.problemId.category].solved += 1;
                interactions[item.problemId.category].total += 1;
            }
        });

        user.failedAttempts.forEach(item => {
            // We need category for failed ones too... 
            // For now let's just use the ones we have in history or fetch them.
        });

        // Sort categories by lowest solved count (or interaction)
        const sortedCats = Object.keys(interactions).sort((a, b) => interactions[a].solved - interactions[b].solved);

        // 2. Find problems in the weakest category that user hasn't solved
        const solvedIds = user.history.map(h => h.problemId._id);

        const recommendations = await Problem.find({
            category: sortedCats[0],
            _id: { $nin: solvedIds },
            status: 'published'
        }).limit(3);

        res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        next(error);
    }
};
