import { searchService } from '../services/search.service.js'

const parsePage = (value) => Math.max(1, Number.parseInt(value || '1', 10) || 1)

export const searchController = {
  async searchMovies(req, res, next) {
    try {
      const q = (req.query.q || '').trim()
      const page = parsePage(req.query.page)

      if (!q) {
        return res.status(400).json({ success: false, message: 'Missing query parameter q' })
      }

      const data = await searchService.searchMovies(q, page)
      res.json({ success: true, keyword: q, ...data })
    } catch (error) {
      next(error)
    }
  },

  async getSuggestions(req, res, next) {
    try {
      const q = (req.query.q || '').trim()
      const limit = Math.max(1, Math.min(20, Number.parseInt(req.query.limit || '10', 10) || 10))
      const data = await searchService.getSuggestions(q, limit)

      res.json({ success: true, q, results: data })
    } catch (error) {
      next(error)
    }
  },

  async searchByCategory(req, res, next) {
    try {
      const category = (req.query.category || '').trim()
      const page = parsePage(req.query.page)

      if (!category) {
        return res.status(400).json({ success: false, message: 'Missing query parameter category' })
      }

      const data = await searchService.searchByCategory(category, page)
      res.json({ success: true, category, ...data })
    } catch (error) {
      next(error)
    }
  },

  async searchByCountry(req, res, next) {
    try {
      const country = (req.query.country || '').trim()
      const page = parsePage(req.query.page)

      if (!country) {
        return res.status(400).json({ success: false, message: 'Missing query parameter country' })
      }

      const data = await searchService.searchByCountry(country, page)
      res.json({ success: true, country, ...data })
    } catch (error) {
      next(error)
    }
  },
}
