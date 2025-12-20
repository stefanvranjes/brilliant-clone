export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'multiple-choice' | 'fill-in-the-blank' | 'interactive';
  category: string;
  hints: string[];
  options?: string[]; // For multiple choice
  correctAnswer?: string | number;
  xpReward: number;
  moduleId?: string;
  visualizationId?: string;
  isDaily?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  problemIds: string[];
  totalXP: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'xp' | 'streak' | 'problems' | 'daily';
  threshold: number;
}

export interface UserProgress {
  userId: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  problemsSolved: number;
  timeSpent: number; // in minutes
  lastActiveDate: string; // YYYY-MM-DD
  dailyChallengeCompleted: boolean;
  unlockedAchievementIds: string[];
  history: {
    problemId: string;
    completedAt: string;
    xpEarned: number;
  }[];
}

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'logic-1',
    title: 'The Three Doors',
    description: 'You are faced with three doors. One leads to freedom, one leads to a fiery pit, and one leads to an endless void. The door to freedom has a sign that says "This is the door". The fiery pit door says "The door to freedom is to the right". The void door says "The door to freedom is not here". Only one sign is true.',
    difficulty: 'Medium',
    type: 'multiple-choice',
    category: 'Logic',
    hints: [
      'If the first door is freedom, its sign is true. What about the others?',
      'Assume the third door is freedom. Is the sign on it true?'
    ],
    options: ['Door 1', 'Door 2', 'Door 3'],
    correctAnswer: 'Door 3',
    xpReward: 150,
    moduleId: 'logic-modeling',
    visualizationId: 'logic-scenario'
  },
  {
    id: 'math-1',
    title: 'Visual Patterns',
    description: 'Which number completes the sequence: 2, 6, 12, 20, 30, ...?',
    difficulty: 'Easy',
    type: 'multiple-choice',
    category: 'Mathematics',
    hints: [
      'Look at the difference between consecutive numbers.',
      'The differences are 4, 6, 8, 10...'
    ],
    options: ['40', '42', '44', '46'],
    correctAnswer: '42',
    xpReward: 100,
    moduleId: 'math-fundamentals',
    isDaily: true
  },
  {
    id: 'cs-1',
    title: 'Binary Basics',
    description: 'What is the decimal representation of the binary number 1011?',
    difficulty: 'Easy',
    type: 'multiple-choice',
    category: 'Computer Science',
    hints: [
      'Positions represent powers of 2: 8, 4, 2, 1',
      '8 + 0 + 2 + 1'
    ],
    options: ['9', '10', '11', '13'],
    correctAnswer: '11',
    xpReward: 100,
    moduleId: 'cs-foundations',
    visualizationId: 'binary-explorer'
  },
  {
    id: 'math-2',
    title: 'Simple Algebra',
    description: 'Solve for x: 2x + 5 = 15',
    difficulty: 'Easy',
    type: 'fill-in-the-blank',
    category: 'Mathematics',
    hints: [
      'Subtract 5 from both sides first.',
      'Then divide by 2.'
    ],
    correctAnswer: '5',
    xpReward: 75,
    moduleId: 'math-fundamentals',
    visualizationId: 'algebra-balance'
  }
];

export const MOCK_MODULES: Module[] = [
  {
    id: 'math-fundamentals',
    title: 'Mathematical Fundamentals',
    description: 'Master the core concepts of algebra and numerical patterns.',
    category: 'Mathematics',
    icon: '🧮',
    problemIds: ['math-1', 'math-2'],
    totalXP: 175
  },
  {
    id: 'logic-modeling',
    title: 'Logic & Deduction',
    description: 'Sharpen your mind with classical logic puzzles and modeling.',
    category: 'Logic',
    icon: '🕵️',
    problemIds: ['logic-1'],
    totalXP: 150
  },
  {
    id: 'cs-foundations',
    title: 'Computer Science Essentials',
    description: 'Explore the foundations of bits, bytes, and computational thinking.',
    category: 'Computer Science',
    icon: '💻',
    problemIds: ['cs-1'],
    totalXP: 100
  }
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Solve your first problem',
    icon: '🚀',
    type: 'problems',
    threshold: 1
  },
  {
    id: 'streak-3',
    title: 'Momentum',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    type: 'streak',
    threshold: 3
  },
  {
    id: 'xp-1000',
    title: 'Knowledgeable',
    description: 'Earn 1000 total XP',
    icon: '📚',
    type: 'xp',
    threshold: 1000
  },
  {
    id: 'daily-master',
    title: 'Daily Dedication',
    description: 'Complete a Daily Challenge',
    icon: '🌟',
    type: 'daily',
    threshold: 1
  }
];

// Initialize with a date in the past to test streak breaking, or yesterday to test continuity
export const MOCK_USER: UserProgress = {
  userId: 'user-123',
  totalXP: 1250,
  level: 5,
  currentStreak: 3,
  longestStreak: 7,
  problemsSolved: 12,
  timeSpent: 120,
  lastActiveDate: '2023-10-25',
  dailyChallengeCompleted: false,
  unlockedAchievementIds: ['first-step'],
  history: [
    { problemId: 'logic-0', completedAt: '2023-10-01', xpEarned: 100 }
  ]
};
