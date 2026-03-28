import axios from 'axios'
import { env } from '../config/env.js'
import { normalizeMovie } from '../utils/normalizeMovie.js'

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 15000,
  params: {
    api_key: env.tmdbApiKey,
    language: 'en-US',
  },
})

const toListPayload = (response, type = 'movie') => ({
  page: response.data?.page || 1,
  total_pages: response.data?.total_pages || 1,
  total_results: response.data?.total_results || 0,
  results: (response.data?.results || []).map((item) => normalizeMovie(item, type)),
})

const toImage = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null

const mapDetailedMovie = (item, type = 'movie') => {
  const isTv = type === 'tv'

  return {
    id: item?.id,
    title: isTv ? item?.name || item?.title || '' : item?.title || item?.name || '',
    poster: toImage(item?.poster_path, 'w500'),
    backdrop: toImage(item?.backdrop_path, 'original'),
    overview: item?.overview || '',
    release_date: isTv ? item?.first_air_date || null : item?.release_date || null,
    rating: item?.vote_average || 0,
    type: isTv ? 'tv' : 'movie',
    genres: (item?.genres || []).map((genre) => genre.name),
    runtime: isTv
      ? Number(item?.episode_run_time?.[0] || 0)
      : Number(item?.runtime || 0),
  }
}

export const tmdbService = {
  async fetchPopularMovies(page = 1) {
    const response = await tmdbClient.get('/movie/popular', { params: { page } })
    return toListPayload(response, 'movie')
  },

  async fetchNewMovies(page = 1) {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        page,
        sort_by: 'release_date.desc',
        include_adult: false,
        include_video: false,
      },
    })

    return toListPayload(response, 'movie')
  },

  async fetchTvSeries(page = 1) {
    const response = await tmdbClient.get('/tv/popular', { params: { page } })
    return toListPayload(response, 'tv')
  },

  async fetchMovieDetails(id, type = 'movie') {
    const endpoint = type === 'tv' ? `/tv/${id}` : `/movie/${id}`
    const response = await tmdbClient.get(endpoint)

    return mapDetailedMovie(response.data, type)
  },

  async fetchMovieDetailsAutoType(id) {
    try {
      return await this.fetchMovieDetails(id, 'movie')
    } catch (error) {
      if (error?.response?.status !== 404) throw error
    }

    return this.fetchMovieDetails(id, 'tv')
  },

  async searchMovies(keyword, page = 1) {
    const response = await tmdbClient.get('/search/multi', {
      params: {
        query: keyword,
        page,
        include_adult: false,
      },
    })

    const results = (response.data?.results || [])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .map((item) => normalizeMovie(item, item.media_type))

    return {
      page: response.data?.page || page,
      total_pages: response.data?.total_pages || 1,
      total_results: response.data?.total_results || results.length,
      results,
    }
  },

  async fetchMoviesByGenre(genreId, page = 1) {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        page,
        with_genres: genreId,
        include_adult: false,
        sort_by: 'popularity.desc',
      },
    })

    return toListPayload(response, 'movie')
  },

  async fetchMoviesByCountry(countryCode, page = 1) {
    const response = await tmdbClient.get('/discover/movie', {
      params: {
        page,
        with_origin_country: countryCode,
        include_adult: false,
        sort_by: 'popularity.desc',
      },
    })

    return toListPayload(response, 'movie')
  },

  async fetchMovieTrailer(id, type = 'movie') {
    const endpoint = type === 'tv' ? `/tv/${id}/videos` : `/movie/${id}/videos`
    const response = await tmdbClient.get(endpoint)
    const videos = response.data?.results || []

    const bestTrailer =
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official) ||
      videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer') ||
      videos.find((video) => video.site === 'YouTube')

    return bestTrailer?.key || null
  },

  async fetchMovieTrailerAutoType(id) {
    try {
      const movieTrailer = await this.fetchMovieTrailer(id, 'movie')
      if (movieTrailer) return movieTrailer
    } catch (error) {
      if (error?.response?.status !== 404) throw error
    }

    return this.fetchMovieTrailer(id, 'tv')
  },
}
