import User from '../models/User.js';
import Problem from '../models/Problem.js';

// @desc    Get user progress
// @route   GET /api/users/:id
// @access  Public (should be private)
export const getUserProgress = async (req, res, next) => {
  try {
    // In a real app, we'd use req.user.id from auth token
    // For this clone, we accept ID in params or create a default one
    let user = await User.findOne({ username: req.params.id });

    if (!user) {
      // Auto-create for demo purposes if not found
      user = await User.create({
        username: req.params.id,
        totalXP: 0,
        level: 1,
        currentStreak: 1
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Update user progress (Solved a problem)
// @route   POST /api/users/:id/solve
// @access  Public
export const solveProblem = async (req, res, next) => {
  try {
    const { problemId, timeSpent } = req.body;
    const username = req.params.id;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
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

    res.status(200).json(user);
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
