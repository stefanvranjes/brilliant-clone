import { MOCK_PROBLEMS, MOCK_USER, Problem, UserProgress } from '../mockData';

const STORAGE_KEYS = {
  USER: 'brilliant_clone_user',
  PROBLEMS: 'brilliant_clone_problems'
};

// Helper to initialize storage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USER));
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Date helpers
const getToday = () => new Date().toISOString().split('T')[0];
const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

export const apiService = {
  getProblem: async (id: string): Promise<Problem> => {
    await delay(500);
    const problem = MOCK_PROBLEMS.find(p => p.id === id);
    if (!problem) throw new Error('Problem not found');
    return problem;
  },

  getAllProblems: async (): Promise<Problem[]> => {
    await delay(500);
    return MOCK_PROBLEMS;
  },

  getUserProgress: async (userId: string): Promise<UserProgress> => {
    await delay(400);
    initStorage();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : MOCK_USER;
    } catch (e) {
      console.error('Failed to parse user progress', e);
      return MOCK_USER;
    }
  },

  updateProgress: async (userId: string, updates: Partial<UserProgress>): Promise<UserProgress> => {
    await delay(300);
    initStorage();
    
    const currentDataStr = localStorage.getItem(STORAGE_KEYS.USER);
    const currentData: UserProgress = currentDataStr ? JSON.parse(currentDataStr) : MOCK_USER;

    // --- Streak Logic ---
    const today = getToday();
    const yesterday = getYesterday();
    const lastActive = currentData.lastActiveDate;
    
    let newStreak = currentData.currentStreak;

    // Only update streak if we haven't already been active today
    if (lastActive !== today) {
      if (lastActive === yesterday) {
        // Continue streak
        newStreak += 1;
      } else {
        // Break streak (missed more than 1 day) or first day
        newStreak = 1;
      }
    }
    
    const newLongestStreak = Math.max(newStreak, currentData.longestStreak);

    // --- XP & Level Logic ---
    const newTotalXP = (currentData.totalXP || 0) + (updates.totalXP || 0);
    const newProblemsSolved = (currentData.problemsSolved || 0) + (updates.problemsSolved || 0);
    
    // Merge updates
    const updatedUser: UserProgress = {
      ...currentData,
      ...updates,
      totalXP: newTotalXP,
      problemsSolved: newProblemsSolved,
      level: Math.floor(newTotalXP / 1000) + 1,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    console.log(`[Mock API] Persisted progress for ${userId}:`, updatedUser);
    
    return updatedUser;
  }
};
