import mongoose from 'mongoose';

// Set strictQuery to suppress deprecation warning
mongoose.set('strictQuery', true);

export const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI || 'Not set');
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'uSetGo-App',
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};