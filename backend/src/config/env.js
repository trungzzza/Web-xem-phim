import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: process.env.PORT || 5000,
  tmdbApiKey: process.env.TMDB_API_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
}

export function validateEnv() {
  const required = ['TMDB_API_KEY', 'SUPABASE_URL', 'SUPABASE_KEY']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}
