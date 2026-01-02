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
    user.xpBalance += problem.xpReward; // Also update spendable balance
    user.weeklyXP = (user.weeklyXP || 0) + problem.xpReward;
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

// @desc    Get public profile
// @route   GET /api/users/profile/:id
// @access  Public
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username displayName avatar totalXP level currentStreak longestStreak problemsSolved achievements createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Purchase shop item
// @route   POST /api/users/purchase
// @access  Private
export const purchaseItem = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Usually we would fetch the item from a ShopItem model to get the price
    // For this prototype, we'll use a simple mock price logic or assume the frontend validated it
    // Better: define the prices here too or shared
    const prices = {
      'streak-freeze': 500,
      'theme-cyberpunk': 1500,
      'theme-forest': 1000
    };

    const price = prices[itemId] || 0;

    if (user.xpBalance < price) {
      return res.status(400).json({ message: 'Insufficient XP balance' });
    }

    if (user.purchasedItemIds.includes(itemId)) {
      return res.status(400).json({ message: 'Item already purchased' });
    }

    user.xpBalance -= price;
    user.purchasedItemIds.push(itemId);

    await user.save();

    const userData = user.toObject();
    userData.unlockedAchievementIds = user.achievements ? user.achievements.map(a => a.id) : [];

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized daily sprint
// @route   GET /api/users/daily-sprint
// @access  Private
export const getDailySprint = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // AI Logic: Identify weak areas or progression needs
    // For this prototype:
    // 1. Get 2 problems from courses the user has started but not finished
    // 2. Get 1 "Review" problem (already solved, but maybe from a week ago)
    // 3. Get 1 "Challenge" problem (slightly higher difficulty)

    const allProblems = await Problem.find();
    const solvedIds = user.history.map(h => h.problemId.toString());

    // Filter available problems
    const reviewPool = allProblems.filter(p => solvedIds.includes(p._id.toString()));
    const newPool = allProblems.filter(p => !solvedIds.includes(p._id.toString()));

    // Simple randomization for now
    const sprintProblems = [];

    // 2 new problems
    if (newPool.length > 0) {
      const shuffledNew = [...newPool].sort(() => 0.5 - Math.random());
      sprintProblems.push(...shuffledNew.slice(0, 2));
    }

    // 1 review problem
    if (reviewPool.length > 0) {
      const shuffledReview = [...reviewPool].sort(() => 0.5 - Math.random());
      sprintProblems.push(shuffledReview[0]);
    }

    // 1 challenge (advanced)
    const challengePool = newPool.filter(p => p.difficulty === 'advanced');
    if (challengePool.length > 0) {
      sprintProblems.push(challengePool[Math.floor(Math.random() * challengePool.length)]);
    } else if (newPool.length > 2) {
      sprintProblems.push(newPool[2]);
    }

    // Remove duplicates if any
    const uniqueIds = Array.from(new Set(sprintProblems.filter(Boolean).map(p => p._id.toString())));
    const uniqueSprint = uniqueIds.map(id => allProblems.find(p => p._id.toString() === id));

    res.status(200).json(uniqueSprint);
  } catch (error) {
    next(error);
  }
};
// @desc    Register a failed problem attempt
// @route   POST /api/users/mistake
// @access  Private
export const registerMistake = async (req, res, next) => {
  try {
    const { problemId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mistakeIndex = user.failedAttempts.findIndex(m => m.problemId.toString() === problemId);

    if (mistakeIndex > -1) {
      // Increment retry count and set next date (e.g., 2^retry days)
      user.failedAttempts[mistakeIndex].retryCount += 1;
      user.failedAttempts[mistakeIndex].lastFailed = new Date();
      const daysToAdd = Math.pow(2, user.failedAttempts[mistakeIndex].retryCount);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      user.failedAttempts[mistakeIndex].nextRetryDate = nextDate;
    } else {
      // First time mistake
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 1); // Retry tomorrow
      user.failedAttempts.push({
        problemId,
        retryCount: 1,
        nextRetryDate: nextDate
      });
    }

    await user.save();
    res.status(200).json(user.failedAttempts);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's mistake bank
// @route   GET /api/users/mistakes
// @access  Private
export const getMistakeBank = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('failedAttempts.problemId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.failedAttempts);
  } catch (error) {
    next(error);
  }
};
