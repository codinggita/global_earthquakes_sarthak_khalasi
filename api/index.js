import app from './backend/src/app.js';
import connectDB from './backend/src/config/db.js';

// Cached connection flag
let isConnected = false;

export default async function handler(req, res) {
  // Establish database connection if not already connected
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless] Database connection failed:', err);
    }
  }

  // Pass request and response to the Express app
  return app(req, res);
}
