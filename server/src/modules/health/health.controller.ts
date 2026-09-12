import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../../config/env';

export const getHealthStatus = (_req: Request, res: Response): void => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'cineflix-api',
      environment: env.NODE_ENV,
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
};
