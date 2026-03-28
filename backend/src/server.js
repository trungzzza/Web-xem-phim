import app from './app.js'
import { env, validateEnv } from './config/env.js'

try {
  validateEnv()

  app.listen(env.port, () => {
    console.log(`Backend running on http://localhost:${env.port}`)
  })
} catch (error) {
  console.error('Failed to start server:', error.message)
  process.exit(1)
}
