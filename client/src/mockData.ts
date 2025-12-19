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
    xpReward: 150
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
    xpReward: 100
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
    xpReward: 100
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
    xpReward: 75
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
  lastActiveDate: '2023-10-25', // Arbitrary past date
  history: [
    { problemId: 'logic-0', completedAt: '2023-10-01', xpEarned: 100 }
  ]
};
