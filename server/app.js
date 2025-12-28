import express from 'express';
import cors from 'cors';
import problemRoutes from './routes/problemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import authRoutes from './routes/authRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

// Health Check & Root
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Brilliant Clone API',
    endpoints: {
      problems: '/api/problems',
      users: '/api/users',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error Handler
app.use(errorHandler);

export default app;
