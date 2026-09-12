import { Router } from 'express';
import { movieController } from './movie.controller';

const router = Router();

// GET /api/v1/movies/home
router.get('/home', movieController.getHomeScreen);

// GET /api/v1/movies/search?q=query&page=1
router.get('/search', movieController.searchMovies);

// GET /api/v1/movies/discover?genre=28&sort=popularity.desc&page=1
router.get('/discover', movieController.discoverMovies);

// GET /api/v1/movies/:id
router.get('/:id', movieController.getMovieDetails);

export default router;
