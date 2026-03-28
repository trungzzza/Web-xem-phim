import { tmdbService } from './tmdb.service.js'
import {
  getCachedMoviesByCategory,
  upsertMoviesToCache,
} from '../models/cache.model.js'

const LIMIT = 20
const TRENDING_TTL_HOURS = 1

async function getOrFetchCategory({ category, page, fetcher, ttlHours = 24 }) {
  const cached = await getCachedMoviesByCategory(category, page, LIMIT, ttlHours)
  if (cached.results.length) return cached

  const fresh = await fetcher(page)
  await upsertMoviesToCache(fresh.results, category)
  return fresh
}

export const movieService = {
  async getPopularMovies(page = 1) {
    return getOrFetchCategory({
      category: 'popular',
      page,
      fetcher: tmdbService.fetchPopularMovies.bind(tmdbService),
      ttlHours: TRENDING_TTL_HOURS,
    })
  },

  async getNewMovies(page = 1) {
    return getOrFetchCategory({
      category: 'new-movies',
      page,
      fetcher: tmdbService.fetchNewMovies.bind(tmdbService),
      ttlHours: 24,
    })
  },

  async getTvSeries(page = 1) {
    return getOrFetchCategory({
      category: 'tv-series',
      page,
      fetcher: tmdbService.fetchTvSeries.bind(tmdbService),
      ttlHours: TRENDING_TTL_HOURS,
    })
  },

  async getMovieDetails(id) {
    const data = await tmdbService.fetchMovieDetailsAutoType(id)
    await upsertMoviesToCache([data], null)
    return data
  },

  async getMovieTrailer(id) {
    return tmdbService.fetchMovieTrailerAutoType(id)
  },
}
