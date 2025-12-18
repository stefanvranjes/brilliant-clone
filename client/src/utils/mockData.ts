// Mock data for development and testing

export const mockProblems = [
  {
    id: '1',
    title: 'The Sum Mystery',
    description: 'If x + y = 10 and x - y = 4, what is the value of x?',
    difficulty: 'beginner',
    type: 'numerical',
    category: 'algebra',
    tags: ['equations', 'systems'],
    hints: [
      { id: 'h1', content: 'Try adding the two equations together', xpCost: 5 },
      { id: 'h2', content: 'When you add them: (x+y) + (x-y) = 10 + 4', xpCost: 10 }
    ],
    solution: {
      answer: 7,
      explanation: 'Adding the equations: 2x = 14, so x = 7'
    },
    xpReward: 50,
    estimatedTime: 5
  },
  {
    id: '2',
    title: 'Prime Pattern',
    description: 'What is the smallest prime number greater than 20?',
    difficulty: 'beginner',
    type: 'numerical',
    category: 'number-theory',
    tags: ['primes', 'basics'],
    hints: [
      { id: 'h1', content: 'Check each number starting from 21', xpCost: 5 },
      { id: 'h2', content: 'Remember: a prime is only divisible by 1 and itself', xpCost: 10 }
    ],
    solution: {
      answer: 23,
      explanation: '21 = 3×7, 22 = 2×11, but 23 is prime!'
    },
    xpReward: 40,
    estimatedTime: 3
  }
];

export const mockUserStats = {
  userId: 'user-1',
  totalXP: 2450,
  currentStreak: 12,
  longestStreak: 28,
  problemsSolved: 47,
  timeSpent: 18000,
  level: 5,
  achievements: [
    {
      id: 'ach1',
      title: 'First Steps',
      description: 'Complete your first problem',
      icon: '🎯'
    },
    {
      id: 'ach2',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥'
    },
    {
      id: 'ach3',
      title: 'Problem Solver',
      description: 'Solve 25 problems',
      icon: '⭐'
    },
    {
      id: 'ach4',
      title: 'Math Master',
      description: 'Complete all algebra basics',
      icon: '🧮'
    },
    {
      id: 'ach5',
      title: 'Speed Runner',
      description: 'Solve a problem in under 1 minute',
      icon: '⚡'
    },
    {
      id: 'ach6',
      title: 'Persistent',
      description: 'Solve a problem after 5+ attempts',
      icon: '💪'
    }
  ]
};