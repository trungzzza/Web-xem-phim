import { movieService } from '../services/movie.service.js'

const parsePage = (value) => Math.max(1, Number.parseInt(value || '1', 10) || 1)

export const movieController = {
  async getNewMovies(req, res, next) {
    try {
      const page = parsePage(req.query.page)
      const data = await movieService.getNewMovies(page)
      res.json({ success: true, ...data })
    } catch (error) {
      next(error)
    }
  },

  async getPopularMovies(req, res, next) {
    try {
      const page = parsePage(req.query.page)
      const data = await movieService.getPopularMovies(page)
      res.json({ success: true, ...data })
    } catch (error) {
      next(error)
    }
  },

  async getTvSeries(req, res, next) {
    try {
      const page = parsePage(req.query.page)
      const data = await movieService.getTvSeries(page)
      res.json({ success: true, ...data })
    } catch (error) {
      next(error)
    }
  },

  async getMovieDetails(req, res, next) {
    try {
      const id = Number.parseInt(req.params.id, 10)
      if (!id) return res.status(400).json({ success: false, message: 'Invalid movie id' })

      const data = await movieService.getMovieDetails(id)
      res.json({ success: true, data })
    } catch (error) {
      next(error)
    }
  },

  async getMovieTrailer(req, res, next) {
    try {
      const id = Number.parseInt(req.params.id, 10)
      if (!id) return res.status(400).json({ success: false, message: 'Invalid movie id' })

      const trailerKey = await movieService.getMovieTrailer(id)
      res.json({ success: true, trailerKey })
    } catch (error) {
      next(error)
    }
  },
}
