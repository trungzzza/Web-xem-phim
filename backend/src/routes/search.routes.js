import { Router } from 'express'
import { searchController } from '../controllers/search.controller.js'

const router = Router()

router.get('/', searchController.searchMovies)
router.get('/category', searchController.searchByCategory)
router.get('/country', searchController.searchByCountry)
router.get('/suggestions', searchController.getSuggestions)

export default router
