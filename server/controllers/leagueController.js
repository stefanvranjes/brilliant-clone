import User from '../models/User.js';

// @desc    Get user's league status
// @route   GET /api/leagues/status
// @access  Private
export const getLeagueStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('currentLeague weeklyXP lastLeagueReset');

        // Find users in the same league for a mini-leaderboard
        const competitors = await User.find({ currentLeague: user.currentLeague })
            .select('displayName weeklyXP')
            .sort({ weeklyXP: -1 })
            .limit(10);

        res.status(200).json({
            user,
            competitors
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Perform weekly league reset (Admin/Cron)
// @route   POST /api/leagues/reset
// @access  Private/Admin
export const resetLeagues = async (req, res, next) => {
    try {
        const users = await User.find();

        for (let user of users) {
            // Promotion Logic
            if (user.weeklyXP > 2000 && user.currentLeague === 'Bronze') user.currentLeague = 'Silver';
            else if (user.weeklyXP > 5000 && user.currentLeague === 'Silver') user.currentLeague = 'Gold';
            else if (user.weeklyXP > 10000 && user.currentLeague === 'Gold') user.currentLeague = 'Diamond';
            else if (user.weeklyXP > 20000 && user.currentLeague === 'Diamond') user.currentLeague = 'Master';

            // Reset weekly XP
            user.weeklyXP = 0;
            user.lastLeagueReset = new Date();
            await user.save();
        }

        res.status(200).json({ message: 'Leagues reset successfully' });
    } catch (error) {
        next(error);
    }
};
