import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../middleware/logger';

export async function connectDatabase(): Promise<void> {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info('MongoDB connected');
    } catch {
        logger.error('MongoDB connection failed');
        throw new Error('Database connection failed');
    }
}