import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGO_URI;

    if (!dbUrl) {
      console.log('No MONGO_URI found, starting MongoMemoryServer...');
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    if (!process.env.MONGO_URI) {
      console.log(`In-memory DB URI: ${dbUrl}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
