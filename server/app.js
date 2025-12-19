import express from 'express';
import cors from 'cors';
import problemRoutes from './routes/problemRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error Handler
app.use(errorHandler);

export default app;
