import express from 'express'
import cors from 'cors'

import movieRoutes from './routes/movie.routes.js'
import searchRoutes from './routes/search.routes.js'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok' })
})

app.use('/api/movies', movieRoutes)
app.use('/api/search', searchRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
