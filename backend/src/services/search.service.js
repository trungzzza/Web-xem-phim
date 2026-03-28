import { tmdbService } from './tmdb.service.js'
import { saveSearchKeyword, getSearchSuggestions } from '../models/searchHistory.model.js'

const CATEGORY_MAP = {
  'phim-hanh-dong': { type: 'genre', genreId: 28 },
  'phim-kinh-di': { type: 'genre', genreId: 27 },
  'phim-vien-tuong': { type: 'genre', genreId: 878 },
  'phim-tinh-cam': { type: 'genre', genreId: 10749 },
  'phim-vo-thuat': { type: 'genre', genreId: 28 },
  'phim-hoat-hinh': { type: 'genre', genreId: 16 },
  'phim-co-trang': { type: 'genre', genreId: 36 },
  'phim-tai-lieu': { type: 'genre', genreId: 99 },
  'phim-the-thao': { type: 'keyword', keyword: 'sports' },
}

const COUNTRY_MAP = {
  'phim-trung-quoc': { countryCode: 'CN' },
  'phim-my': { countryCode: 'US' },
  'phim-han-quoc': { countryCode: 'KR' },
  'phim-nhat-ban': { countryCode: 'JP' },
  'phim-hong-kong': { countryCode: 'HK' },
  'phim-thai-lan': { countryCode: 'TH' },
  'phim-an-do': { countryCode: 'IN' },
  'phim-dai-loan': { countryCode: 'TW' },
  'phim-anh': { countryCode: 'GB' },
  'phim-viet-nam': { countryCode: 'VN' },
}

export const searchService = {
  async searchMovies(keyword, page = 1) {
    const data = await tmdbService.searchMovies(keyword, page)
    await saveSearchKeyword(keyword)
    return data
  },

  async getSuggestions(keyword, limit = 10) {
    if (!keyword || keyword.length < 2) return []
    return getSearchSuggestions(keyword, limit)
  },

  async searchByCategory(category, page = 1) {
    const selected = CATEGORY_MAP[category]
    if (!selected) {
      const error = new Error('Invalid category')
      error.status = 400
      throw error
    }

    if (selected.type === 'genre') {
      return tmdbService.fetchMoviesByGenre(selected.genreId, page)
    }

    return tmdbService.searchMovies(selected.keyword, page)
  },

  async searchByCountry(country, page = 1) {
    const selected = COUNTRY_MAP[country]
    if (!selected) {
      const error = new Error('Invalid country')
      error.status = 400
      throw error
    }

    return tmdbService.fetchMoviesByCountry(selected.countryCode, page)
  },
}
