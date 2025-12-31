import {
  Problem,
  UserStats,
  Achievement,
  Course,
  Chapter,
  Hint,
  ShopItem
} from '../../shared/types';

// Shared types across the application
export type { Problem, UserStats, Achievement, Course, Chapter, ShopItem };

export interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  problemIds: string[];
  totalXP: number;
}

// Helper to create hints
const createHints = (contents: string[]): Hint[] =>
  contents.map((content, i) => ({
    id: `hint-${i}`,
    content,
    order: i,
    xpCost: 0
  }));

export const MOCK_PROBLEMS: any[] = [
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
  },
  {
    id: 'geom-1',
    title: 'Circle Symmetry',
    description: 'Which of these shapes has more than two lines of symmetry?',
    difficulty: 'beginner',
    type: 'choice-with-image',
    category: 'Geometry',
    tags: ['geometry', 'symmetry'],
    options: [
      { text: 'Rectangle', image: 'https://placehold.co/400x400/png?text=Rectangle' },
      { text: 'Equilateral Triangle', image: 'https://placehold.co/400x400/png?text=Triangle' },
      { text: 'Circle', image: 'https://placehold.co/400x400/png?text=Circle' },
      { text: 'Isosceles Triangle', image: 'https://placehold.co/400x400/png?text=Isosceles' }
    ],
    hints: createHints([
      'Symmetry lines divide a shape into mirror images.',
      'A rectangle has 2, a triangle can have 3...',
      'Think about a circle: how many ways can you fold it in half?'
    ]),
    xpReward: 125,
    estimatedTime: 3,
    solution: {
      answer: 'Circle',
      explanation: 'A circle has an infinite number of lines of symmetry, which is definitely more than two.'
    },
    moduleId: 'math-fundamentals'
  },
  {
    id: 'geom-2',
    title: 'Plotting Points',
    description: 'Find the coordinate of the point marked in blue.',
    difficulty: 'beginner',
    type: 'numerical',
    category: 'Geometry',
    tags: ['geometry', 'coordinates'],
    visualizationId: 'coordinate-plane',
    visualizationConfig: {
      points: [
        { x: 3, y: 4, label: 'P', color: '#2563eb' }
      ],
      gridRange: 5
    },
    hints: createHints([
      'Start at the origin (0,0).',
      'Move right along the x-axis to 3.',
      'Then move up along the y-axis to find the height.'
    ]),
    xpReward: 100,
    estimatedTime: 2,
    solution: {
      answer: '4',
      explanation: 'The point P is located at x=3 and y=4.'
    },
    moduleId: 'math-fundamentals'
  },
  {
    id: 'cs-2',
    title: 'Algorithm Steps',
    description: 'Order the steps of a typical Binary Search algorithm correctly.',
    difficulty: 'intermediate',
    type: 'sorting',
    category: 'Computer Science',
    tags: ['algorithms', 'binary-search'],
    options: [
      { id: 'step-1', content: 'Calculate the middle index' },
      { id: 'step-2', content: 'Compare middle element with target' },
      { id: 'step-3', content: 'If target matches middle, return index' },
      { id: 'step-4', content: 'If target is smaller, search left half' },
      { id: 'step-5', content: 'If target is larger, search right half' }
    ],
    hints: createHints([
      'You start by finding the midpoint.',
      'Comparison happens after you have the middle element.'
    ]),
    xpReward: 200,
    estimatedTime: 6,
    solution: {
      answer: ['step-1', 'step-2', 'step-3', 'step-4', 'step-5'],
      explanation: 'Binary search starts by finding the middle, comparing it, and then narrowing the range.'
    },
    moduleId: 'cs-foundations'
  },
  {
    id: 'logic-2',
    title: 'Half Adder Logic',
    description: 'A Half Adder circuit computes the sum of two binary digits. Explore the circuit and verify the outputs.',
    difficulty: 'advanced',
    type: 'logic-circuit',
    category: 'Computer Science',
    tags: ['digital-logic', 'hardware'],
    visualizationId: 'logic-circuit-sim',
    visualizationConfig: {
      inputs: [
        { id: 'in-a', label: 'Input A', initialValue: false },
        { id: 'in-b', label: 'Input B', initialValue: false }
      ],
      gates: [
        { id: 'xor-1', type: 'XOR', inputA: 'in-a', inputB: 'in-b', label: 'Sum Gate' },
        { id: 'and-1', type: 'AND', inputA: 'in-a', inputB: 'in-b', label: 'Carry Gate' }
      ],
      outputs: [
        { id: 'out-sum', label: 'Sum (S)', source: 'xor-1' },
        { id: 'out-carry', label: 'Carry (C)', source: 'and-1' }
      ]
    },
    hints: createHints([
      'A + B in binary results in a Sum and a Carry.',
      '1 + 1 = 10 (Sum 0, Carry 1).'
    ]),
    xpReward: 250,
    estimatedTime: 8,
    solution: {
      answer: 'Interactive',
      explanation: 'The XOR gate produces the Sum bit, while the AND gate produces the Carry bit.'
    },
    moduleId: 'cs-foundations'
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
  },
  {
    id: 'cs-ch-1',
    title: 'Computer Science Basics',
    description: 'Learn about binary and algorithms.',
    order: 1,
    problems: ['cs-1', 'cs-2', 'logic-2'],
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
  },
  {
    id: 'logic-modeling',
    title: 'Logic & Modeling',
    description: 'Learn to represent complex problems with logical statements.',
    category: 'Logic',
    difficulty: 'intermediate',
    chapters: [MOCK_CHAPTERS[0]],
    estimatedHours: 3,
    enrollmentCount: 900,
    prerequisites: ['math-fundamentals']
  },
  {
    id: 'cs-foundations',
    title: 'Computer Science Foundations',
    description: 'Explore the building blocks of computing.',
    category: 'Computer Science',
    difficulty: 'beginner',
    chapters: [MOCK_CHAPTERS[1]],
    estimatedHours: 4,
    enrollmentCount: 1200,
    prerequisites: ['logic-modeling']
  },
  {
    id: 'algorithms-1',
    title: 'Algorithms I',
    description: 'Fundamental sorting and searching techniques.',
    category: 'Computer Science',
    difficulty: 'intermediate',
    chapters: [MOCK_CHAPTERS[1]],
    estimatedHours: 5,
    enrollmentCount: 800,
    prerequisites: ['cs-foundations']
  }
];

export const MOCK_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak-freeze',
    title: 'Streak Freeze',
    description: 'Protects your streak for one day if you forget to learn.',
    price: 500,
    icon: '🧊',
    type: 'streak-freeze'
  },
  {
    id: 'theme-cyberpunk',
    title: 'Cyberpunk Theme',
    description: 'A neon-drenched futuristic look for your dashboard.',
    price: 1500,
    icon: '🌃',
    type: 'theme',
    config: { primary: '#f0f', secondary: '#0ff' }
  },
  {
    id: 'theme-forest',
    title: 'Evergreen Theme',
    description: 'Calming greens and natural tones.',
    price: 1000,
    icon: '🌲',
    type: 'theme',
    config: { primary: '#2d5a27', secondary: '#8eb364' }
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
  xpBalance: 750, // Starting with some spendable XP
  level: 5,
  currentStreak: 3,
  longestStreak: 7,
  problemsSolved: 12,
  timeSpent: 120,
  achievements: [],
  purchasedItemIds: []
};

// For backward compatibility during migration
export const MOCK_USER = MOCK_USER_STATS;
export const MOCK_MODULES: Module[] = MOCK_COURSES.map(c => ({
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
