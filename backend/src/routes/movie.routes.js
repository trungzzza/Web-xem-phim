import { Router } from 'express'
import { movieController } from '../controllers/movie.controller.js'

const router = Router()

router.get('/new-movies', movieController.getNewMovies)
router.get('/popular', movieController.getPopularMovies)
router.get('/tv-series', movieController.getTvSeries)
router.get('/:id/trailer', movieController.getMovieTrailer)
router.get('/:id', movieController.getMovieDetails)

export default router
