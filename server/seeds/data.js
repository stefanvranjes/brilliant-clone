export const MOCK_PROBLEMS = [
    {
        slug: 'logic-1',
        title: 'The Three Doors',
        description: 'You are faced with three doors. One leads to freedom, one leads to a fiery pit, and one leads to an endless void. The door to freedom has a sign that says "This is the door". The fiery pit door says "The door to freedom is to the right". The void door says "The door to freedom is not here". Only one sign is true.',
        difficulty: 'intermediate',
        type: 'multiple-choice',
        category: 'Logic',
        tags: ['logic', 'puzzles'],
        options: ['Door 1', 'Door 2', 'Door 3'],
        hints: [
            { content: 'If the first door is freedom, its sign is true. What about the others?', order: 1 },
            { content: 'Assume the third door is freedom. Is the sign on it true?', order: 2 }
        ],
        solution: {
            answer: 'Door 3',
            explanation: 'If Door 3 is freedom, then only its sign is true. The others are false.'
        },
        xpReward: 150,
        estimatedTime: 5,
        visualizationId: 'logic-scenario',
        visualizationConfig: {
            doorCount: 3,
            signs: [
                { id: 1, text: "This is the door", trueIfDoorIs: [1] },
                { id: 2, text: "The door to freedom is to the right", trueIfDoorIs: [3] },
                { id: 3, text: "The door to freedom is not here", trueIfDoorIs: [1, 2] }
            ]
        }
    },
    {
        slug: 'binary-explorer',
        title: 'Binary Basics',
        description: 'What is the decimal representation of the binary number 1011?',
        difficulty: 'beginner',
        type: 'multiple-choice',
        category: 'Computer Science',
        tags: ['binary', 'numbers'],
        options: ['9', '10', '11', '13'],
        hints: [
            { content: 'Positions represent powers of 2: 8, 4, 2, 1', order: 1 },
            { content: '8 + 0 + 2 + 1', order: 2 }
        ],
        solution: {
            answer: '11',
            explanation: '1011 in binary is 1*2^3 + 0*2^2 + 1*2^1 + 1*2^0 = 8 + 0 + 2 + 1 = 11.'
        },
        xpReward: 100,
        estimatedTime: 3,
        isDaily: true,
        visualizationId: 'binary-explorer',
        visualizationConfig: {
            initialBits: [1, 0, 1, 1]
        }
    },
    {
        slug: 'math-1', // Actually math-1 in frontend mockData, let's keep it consistent
        title: 'Simple Algebra',
        description: 'Solve for x: 2x + 5 = 15',
        difficulty: 'beginner',
        type: 'numerical',
        category: 'Mathematics',
        tags: ['algebra', 'equations'],
        hints: [
            { content: 'Subtract 5 from both sides first.', order: 1 },
            { content: 'Then divide by 2.', order: 2 }
        ],
        solution: {
            answer: '5',
            explanation: '2x + 5 = 15 => 2x = 10 => x = 5.'
        },
        xpReward: 75,
        estimatedTime: 2,
        visualizationId: 'algebra-balance',
        visualizationConfig: {
            target: 15,
            constant: 5,
            multiplier: 2,
            variableName: 'x'
        }
    }
];

export const MOCK_USER = {
    username: 'user-123',
    displayName: 'Stefan',
    email: 'stefan@example.com',
    password: 'password123',
    totalXP: 1250,
    level: 2,
    currentStreak: 5,
    longestStreak: 7,
    problemsSolved: 12
};

export const MOCK_ACHIEVEMENTS = [
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

export const MOCK_COURSES = [
    {
        id: 'math-fundamentals',
        title: 'Mathematical Fundamentals',
        description: 'Master the core concepts of algebra and numerical patterns.',
        category: 'Mathematics',
        difficulty: 'beginner',
        estimatedHours: 2,
        enrollmentCount: 1500,
        chapters: [
            {
                title: 'Numerical Patterns',
                description: 'Explore the beauty of numbers.',
                order: 1,
                problems: ['math-1', 'math-2'], // These are placeholders, will be mapped to ObjectIds
                isLocked: false
            }
        ]
    },
    {
        id: 'logic-modeling',
        title: 'Logic & Modeling',
        description: 'Learn to think like a logician through puzzles and scenarios.',
        category: 'Logic',
        difficulty: 'intermediate',
        estimatedHours: 3,
        enrollmentCount: 1200,
        chapters: [
            {
                title: 'The Art of Deduction',
                description: 'Solve complex logical puzzles.',
                order: 1,
                problems: ['logic-1'],
                isLocked: false
            }
        ]
    }
];
