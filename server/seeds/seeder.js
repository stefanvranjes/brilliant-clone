import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const MOCK_PROBLEMS = [
  {
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
    visualizationId: 'logic-scenario'
  },
  {
    title: 'Visual Patterns',
    description: 'Which number completes the sequence: 2, 6, 12, 20, 30, ...?',
    difficulty: 'beginner',
    type: 'multiple-choice',
    category: 'Mathematics',
    tags: ['patterns', 'sequence'],
    options: ['40', '42', '44', '46'],
    hints: [
      { content: 'Look at the difference between consecutive numbers.', order: 1 },
      { content: 'The differences are 4, 6, 8, 10...', order: 2 }
    ],
    solution: {
      answer: '42',
      explanation: 'The difference increases by 2 each time. The next difference is 12, so 30 + 12 = 42.'
    },
    xpReward: 100,
    estimatedTime: 3
  },
  {
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
    estimatedTime: 4,
    visualizationId: 'binary-explorer'
  },
  {
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
    visualizationId: 'algebra-balance'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await Problem.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed...');

    await Problem.insertMany(MOCK_PROBLEMS);

    // Create a default user
    await User.create({
      username: 'user-123',
      displayName: 'Stefan',
      totalXP: 1250,
      level: 2,
      currentStreak: 5,
      longestStreak: 7,
      problemsSolved: 12
    });

    console.log('Data Imported!');
    // If using memory server, we might want to keep it open? 
    // But seeder script usually exits.
    // NOTE: Memory server dies on process exit.
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedData();
