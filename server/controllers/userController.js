import User from '../models/User.js';
import Problem from '../models/Problem.js';

// @desc    Get user progress
// @route   GET /api/users/:id
// @access  Public (should be private)
export const getUserProgress = async (req, res, next) => {
  try {
    // Use req.user.id from protect middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user.toObject();
    userData.unlockedAchievementIds = user.achievements ? user.achievements.map(a => a.id) : [];

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user progress (Solved a problem)
// @route   POST /api/users/:id/solve
// @access  Public
export const solveProblem = async (req, res, next) => {
  try {
    const { problemId, timeSpent } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      res.status(404);
      throw new Error('Problem not found');
    }

    // Check if already solved to prevent duplicate XP? 
    // For now, allow re-solving but maybe limit XP

    user.totalXP += problem.xpReward;
    user.problemsSolved += 1;
    user.timeSpent += timeSpent || 0; // Add minutes

    // Update Level
    user.calculateLevel();

    // Update Streak
    user.updateStreak();

    // Add to history
    user.history.push({
      problemId: problem._id,
      xpEarned: problem.xpReward
    });

    await user.save();

    const userData = user.toObject();
    userData.unlockedAchievementIds = user.achievements ? user.achievements.map(a => a.id) : [];

    res.status(200).json(userData);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Generic update (for syncing local state if needed)
// @route   PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
export const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find()
      .select('username displayName avatar totalXP currentStreak level')
      .sort({ totalXP: -1 })
      .limit(50);

    res.status(200).json(topUsers);
  } catch (error) {
    next(error);
  }
};
