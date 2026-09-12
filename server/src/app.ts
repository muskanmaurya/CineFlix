import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { httpLogger } from './middleware/logger';
import { globalRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './modules/health/health.routes';
import movieRoutes from './modules/movies/movie.routes';
import wishlistRoutes from './modules/wishlist/wishlist.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(globalRateLimiter);

// Logging & Body Parsing
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Resource not found',
      code: 'NOT_FOUND',
    },
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
