import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

dotenv.config();

const MOCK_PROBLEMS = [
  {
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
    title: 'Visual Patterns',
    description: 'Which shape comes next in the sequence?',
    difficulty: 'Easy',
    type: 'multiple-choice',
    category: 'Math',
    hints: ['Look at the number of sides.'],
    options: ['Triangle', 'Square', 'Pentagon'],
    correctAnswer: 'Pentagon',
    xpReward: 100
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/brilliant_clone');

    await Problem.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed...');

    await Problem.insertMany(MOCK_PROBLEMS);

    // Create a default user
    await User.create({
        username: 'user-123',
        totalXP: 1250,
        level: 2,
        currentStreak: 5,
        longestStreak: 7,
        problemsSolved: 12
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

seedData();
