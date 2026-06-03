import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

// Load env configuration
dotenv.config();

// Establish MongoDB connection
connectDB();

const PORT = process.env.PORT || 5000;

// ==========================================
// Server Initialization
// ==========================================
const server = app.listen(PORT, () => {
  console.log(`[Server] Production-ready API Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

// Graceful Shutdown on termination signals
process.on('SIGTERM', () => {
  console.info('[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    console.log('[Server] Process terminated.');
    process.exit(0);
  });
});

export default app;
