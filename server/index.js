import dotenv from 'dotenv';
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import Problem from './models/Problem.js';
import User from './models/User.js';
import Course from './models/Course.js';
import Achievement from './models/Achievement.js';
import { MOCK_PROBLEMS, MOCK_USER, MOCK_COURSES, MOCK_ACHIEVEMENTS } from './seeds/data.js';
import { initSocket } from './socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Connect to DB and listen
connectDB().then(async () => {
  // Auto-seed if in-memory database is used
  if (!process.env.MONGO_URI) {
    const problemCount = await Problem.countDocuments();
    if (problemCount === 0) {
      console.log('In-memory database detected, auto-seeding...');

      // Seed Problems
      const seededProblems = await Problem.insertMany(MOCK_PROBLEMS);
      console.log(`${seededProblems.length} problems seeded.`);

      // Seed Achievements
      await Achievement.insertMany(MOCK_ACHIEVEMENTS);
      console.log('Achievements seeded.');

      // Seed Courses with mapped problem IDs
      const courseData = MOCK_COURSES.map(course => ({
        ...course,
        chapters: course.chapters.map(chapter => ({
          ...chapter,
          problems: chapter.problems.map(pSlug => {
            const foundProblem = seededProblems.find(sp => sp.slug === pSlug);
            return foundProblem ? foundProblem._id : null;
          }).filter(id => id !== null)
        }))
      }));
      await Course.insertMany(courseData);
      console.log('Courses seeded.');

      await User.create(MOCK_USER);
      console.log('Auto-seeding complete.');
    }
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
