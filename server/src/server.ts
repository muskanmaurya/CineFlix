import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './middleware/logger';

const server = app.listen(env.PORT, async () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  logger.info(`🏥 Health check endpoint: http://localhost:${env.PORT}/api/v1/health`);

  // Initialize MongoDB Database connection
  await connectDatabase();
});

const handleExit = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));
