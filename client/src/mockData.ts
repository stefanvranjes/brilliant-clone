import {
  Problem,
  UserStats,
  Achievement,
  Course,
  Chapter,
  Solution,
  Hint
} from '../../shared/types';

// Extend Problem for local needs if necessary, or just use the shared one
// The shared Problem has difficulty: 'beginner' | 'intermediate' | 'advanced'
// while mockData had 'Easy' | 'Medium' | 'Hard'. We'll align to shared.

export type { Problem, UserStats, Achievement, Course, Chapter };

// Helper to create hints
const createHints = (contents: string[]): Hint[] =>
  contents.map((content, i) => ({
    id: `hint-${i}`,
    content,
    order: i,
    xpCost: 0
  }));

export const MOCK_PROBLEMS: (Problem & { moduleId?: string, isDaily?: boolean })[] = [
  {
    id: 'logic-1',
    title: 'The Three Doors',
    description: 'You are faced with three doors. One leads to freedom, one leads to a fiery pit, and one leads to an endless void. The door to freedom has a sign that says "This is the door". The fiery pit door says "The door to freedom is to the right". The void door says "The door to freedom is not here". Only one sign is true.',
    difficulty: 'intermediate',
    type: 'multiple-choice',
    category: 'Logic',
    tags: ['logic', 'puzzles'],
    options: ['Door 1', 'Door 2', 'Door 3'],
    hints: createHints([
      'If the first door is freedom, its sign is true. What about the others?',
      'Assume the third door is freedom. Is the sign on it true?'
    ]),
    xpReward: 150,
    estimatedTime: 5,
    solution: {
      answer: 'Door 3',
      explanation: 'If Door 3 is freedom, then only its sign is true. The others are false.'
    },
    moduleId: 'logic-modeling',
    visualizationId: 'logic-scenario'
  },
  {
    id: 'math-1',
    title: 'Visual Patterns',
    description: 'Which number completes the sequence: 2, 6, 12, 20, 30, ...?',
    difficulty: 'beginner',
    type: 'multiple-choice',
    category: 'Mathematics',
    tags: ['patterns', 'sequence'],
    options: ['40', '42', '44', '46'],
    hints: createHints([
      'Look at the difference between consecutive numbers.',
      'The differences are 4, 6, 8, 10...'
    ]),
    xpReward: 100,
    estimatedTime: 3,
    solution: {
      answer: '42',
      explanation: 'The difference increases by 2 each time. The next difference is 12, so 30 + 12 = 42.'
    },
    moduleId: 'math-fundamentals',
    isDaily: true
  },
  {
    id: 'cs-1',
    title: 'Binary Basics',
    description: 'What is the decimal representation of the binary number 1011?',
    difficulty: 'beginner',
    type: 'multiple-choice',
    category: 'Computer Science',
    tags: ['binary', 'numbers'],
    options: ['9', '10', '11', '13'],
    hints: createHints([
      'Positions represent powers of 2: 8, 4, 2, 1',
      '8 + 0 + 2 + 1'
    ]),
    xpReward: 100,
    estimatedTime: 4,
    solution: {
      answer: '11',
      explanation: '1011 in binary is 1*2^3 + 0*2^2 + 1*2^1 + 1*2^0 = 8 + 0 + 2 + 1 = 11.'
    },
    moduleId: 'cs-foundations',
    visualizationId: 'binary-explorer'
  },
  {
    id: 'math-2',
    title: 'Simple Algebra',
    description: 'Solve for x: 2x + 5 = 15',
    difficulty: 'beginner',
    type: 'numerical',
    category: 'Mathematics',
    tags: ['algebra', 'equations'],
    hints: createHints([
      'Subtract 5 from both sides first.',
      'Then divide by 2.'
    ]),
    xpReward: 75,
    estimatedTime: 2,
    solution: {
      answer: '5',
      explanation: '2x + 5 = 15 => 2x = 10 => x = 5.'
    },
    moduleId: 'math-fundamentals',
    visualizationId: 'algebra-balance'
  }
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'math-ch-1',
    title: 'Numerical Patterns',
    description: 'Explore the beauty of numbers.',
    order: 1,
    problems: ['math-1', 'math-2'],
    isLocked: false
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'math-fundamentals',
    title: 'Mathematical Fundamentals',
    description: 'Master the core concepts of algebra and numerical patterns.',
    category: 'Mathematics',
    difficulty: 'beginner',
    chapters: MOCK_CHAPTERS,
    estimatedHours: 2,
    enrollmentCount: 1500
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Solve your first problem',
    icon: '🚀',
    problemsRequired: 1
  },
  {
    id: 'streak-3',
    title: 'Momentum',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    streakRequired: 3
  },
  {
    id: 'xp-1000',
    title: 'Knowledgeable',
    description: 'Earn 1000 total XP',
    icon: '📚',
    xpRequired: 1000
  }
];

export const MOCK_USER_STATS: UserStats = {
  userId: 'user-123',
  totalXP: 1250,
  level: 5,
  currentStreak: 3,
  longestStreak: 7,
  problemsSolved: 12,
  timeSpent: 120, // in seconds or minutes? shared/types says timeSpent: number
  achievements: [],
};

// For backward compatibility during migration
export const MOCK_USER = MOCK_USER_STATS;
export const MOCK_MODULES = MOCK_COURSES.map(c => ({
  id: c.id,
  title: c.title,
  description: c.description,
  category: c.category,
  icon: '🧮', // Default
  problemIds: c.chapters.flatMap(ch => ch.problems),
  totalXP: 500 // Placeholder
}));

// Mock UserProgress for api.service.ts
export interface UserProgress extends UserStats {
  lastActiveDate: string;
  dailyChallengeCompleted: boolean;
  unlockedAchievementIds: string[];
  history: any[];
}

export const INITIAL_USER_PROGRESS: UserProgress = {
  ...MOCK_USER_STATS,
  lastActiveDate: '2023-10-25',
  dailyChallengeCompleted: false,
  unlockedAchievementIds: ['first-step'],
  history: []
};
