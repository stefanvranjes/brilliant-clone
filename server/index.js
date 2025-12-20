import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import Problem from './models/Problem.js';
import User from './models/User.js';
import { MOCK_PROBLEMS, MOCK_USER } from './seeds/data.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to DB and listen
connectDB().then(async () => {
  // Auto-seed if in-memory database is used
  if (!process.env.MONGO_URI) {
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      console.log('In-memory database detected, auto-seeding...');
      await Problem.insertMany(MOCK_PROBLEMS);
      await User.create(MOCK_USER);
      console.log('Auto-seeding complete.');
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
