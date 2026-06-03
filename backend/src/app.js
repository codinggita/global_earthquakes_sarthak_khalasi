import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Route imports
import authRoutes from './routes/authRoutes.js';
import earthquakeRoutes from './routes/earthquakeRoutes.js';
import userReportRoutes from './routes/userReportRoutes.js';

// Middleware imports
import loggerMiddleware from './middlewares/loggerMiddleware.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import rateLimiter from './middlewares/rateLimiter.js';
import ApiResponse from './utils/apiResponse.js';

const app = express();

// ==========================================
// Global Middlewares
// ==========================================

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true, // Allow cookies
}));

// Request Body Parser (JSON)
app.use(express.json());

// Inlined, Zero-Dependency Cookie Parser Middleware
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts.shift().trim();
      const value = parts.join('=');
      req.cookies[name] = decodeURIComponent(value);
    });
  }
  next();
});

// Custom Request Logger Middleware
app.use(loggerMiddleware);

// Basic Security Rate Limiter (Good-to-have #8)
app.use(rateLimiter);

// ==========================================
// Route Declarations
// ==========================================

// Versioned API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/earthquakes', earthquakeRoutes);
app.use('/api/v1/reports', userReportRoutes);

// Health Check API (Good-to-have #15)
app.get('/api/v1/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const healthData = {
    status: 'Healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStates[dbStatus] || 'Unknown',
      readyState: dbStatus,
    },
  };

  res.status(200).json(
    ApiResponse.success(200, healthData, 'Server status compiled successfully')
  );
});

// Wildcard 404 Route Handler
app.use('*', (req, res) => {
  res.status(404).json(
    ApiResponse.error(404, `Endpoint [${req.method} ${req.originalUrl}] does not exist on this server.`)
  );
});

// Centralized Global Error Handler Middleware
app.use(errorMiddleware);

export default app;
