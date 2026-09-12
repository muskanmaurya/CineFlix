import { z } from 'zod';

export const visitorIdSchema = z
  .string({ required_error: 'Header "X-Visitor-Id" is required' })
  .uuid({ message: 'Header "X-Visitor-Id" must be a valid UUID' });

export const addWishlistBodySchema = z.object({
  movieId: z
    .number({ required_error: 'movieId is required' })
    .int('movieId must be an integer')
    .positive('movieId must be a positive number'),
  title: z
    .string({ required_error: 'title is required' })
    .trim()
    .min(1, 'title cannot be empty'),
  posterPath: z.string().nullable().optional().default(null),
  releaseDate: z.string().nullable().optional().default(null),
  rating: z.number().nullable().optional().default(null),
});

export const deleteWishlistParamSchema = z.object({
  movieId: z
    .string({ required_error: 'movieId URL parameter is required' })
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int('movieId must be an integer')
        .positive('movieId must be a positive number')
    ),
});
