import Activity from '../models/Activity.js';

// @desc    Get social feed activities
// @route   GET /api/activities
// @access  Private
export const getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('user', 'displayName username avatar level');

        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Give kudos to an activity
// @route   POST /api/activities/:id/kudos
// @access  Private
export const giveKudos = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id);

        if (!activity) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }

        // Check if already given kudos
        if (activity.kudos.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'Already gave kudos' });
        }

        activity.kudos.push(req.user._id);
        await activity.save();

        res.status(200).json({
            success: true,
            data: activity
        });
    } catch (error) {
        next(error);
    }
};
