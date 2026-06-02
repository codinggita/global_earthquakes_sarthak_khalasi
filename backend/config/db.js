import mongoose from 'mongoose';

/**
 * Connects to MongoDB and sets up event listeners for the connection lifecycle.
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/global_earthquakes';
    
    // Connect to MongoDB
    const conn = await mongoose.connect(connStr);

    console.log(`[Database] MongoDB Connected successfully to host: ${conn.connection.host}`);
    
    // Set up lifecycle event listeners
    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] WARNING: MongoDB disconnected.');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`[Database] ERROR: MongoDB connection error: ${err.message}`);
    });

  } catch (error) {
    console.error(`[Database] CRITICAL: MongoDB connection failed: ${error.message}`);
    // Exit process with failure in production, but let it stand in dev so we don't crash loops
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
