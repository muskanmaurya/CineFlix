import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Load environment variables from server/.env file
const envPath = fs.existsSync(path.resolve(process.cwd(), '.env'))
  ? path.resolve(process.cwd(), '.env')
  : path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  TMDB_API_KEY: z.string().optional().default(''),
  TMDB_READ_ACCESS_TOKEN: z.string().optional().default(''),
  TMDB_BASE_URL: z.string().url().default('https://api.themoviedb.org/3'),
  MONGODB_URI: z.string().optional().default('mongodb://localhost:27017/cineflix'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables configuration');
  }
  return result.data;
};

export const env = parseEnv();
