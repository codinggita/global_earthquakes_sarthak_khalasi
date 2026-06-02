/**
 * Request Logging Middleware tracking method, route path, status, and response latency.
 */
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Hook the response finish event to measure performance
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    // Choose indicators based on HTTP status
    let statusIndicator = '✅';
    if (statusCode >= 400 && statusCode < 500) {
      statusIndicator = '⚠️';
    } else if (statusCode >= 500) {
      statusIndicator = '🚨';
    }
    
    console.log(
      `[API-Logger] ${statusIndicator} ${timestamp} | ${method} ${originalUrl} | Status: ${statusCode} | Latency: ${duration}ms`
    );
  });

  next();
};

export default loggerMiddleware;
