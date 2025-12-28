import Achievement from '../models/Achievement.js';

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
export const getAchievements = async (req, res, next) => {
    try {
        const achievements = await Achievement.find();
        res.status(200).json(achievements);
    } catch (error) {
        next(error);
    }
};
