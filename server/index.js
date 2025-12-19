import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/brilliant_clone';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to DB and listen
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
