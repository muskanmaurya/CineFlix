import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z
    .string({ required_error: 'Query parameter "q" is required' })
    .trim()
    .min(1, { message: 'Query parameter "q" cannot be empty' }),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(
      z.number().int().min(1, 'Page must be at least 1').max(500, 'Page cannot exceed 500')
    )
    .default('1'),
});

export const ALLOWED_SORT_OPTIONS = [
  'popularity.desc',
  'popularity.asc',
  'vote_average.desc',
  'vote_average.asc',
  'primary_release_date.desc',
  'primary_release_date.asc',
] as const;

export const discoverQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(
      z.number().int().min(1, 'Page must be at least 1').max(500, 'Page cannot exceed 500')
    )
    .default('1'),
  genre: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  sort: z
    .enum(ALLOWED_SORT_OPTIONS, {
      errorMap: () => ({
        message: `Sort parameter must be one of: ${ALLOWED_SORT_OPTIONS.join(', ')}`,
      }),
    })
    .optional()
    .default('popularity.desc'),
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(
      z
        .number()
        .int()
        .min(1900, 'Year must be after 1900')
        .max(2100, 'Year cannot be past 2100')
        .optional()
    ),
});

export const movieIdSchema = z.object({
  id: z
    .string({ required_error: 'Movie ID parameter is required' })
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number().int({ message: 'Movie ID must be an integer' }).positive({ message: 'Movie ID must be a positive number' })
    ),
});
