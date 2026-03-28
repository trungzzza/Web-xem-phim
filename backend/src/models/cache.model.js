import { supabase } from '../config/supabase.js'
import { mapCacheRowToMovie } from '../utils/normalizeMovie.js'

const TABLE = 'movies_cache'

export async function getCachedMoviesByCategory(category, page = 1, limit = 20, ttlHours = 1) {
  const from = (page - 1) * limit
  const to = from + limit - 1
  const ttlDate = new Date(Date.now() - ttlHours * 60 * 60 * 1000).toISOString()

  const { data, error, count } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact' })
    .eq('category', category)
    .gte('created_at', ttlDate)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    page,
    total_results: count || 0,
    total_pages: Math.max(1, Math.ceil((count || 0) / limit)),
    results: (data || []).map(mapCacheRowToMovie),
  }
}

export async function getCachedMovieByTmdbId(tmdbId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('tmdb_id', tmdbId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return mapCacheRowToMovie(data)
}

export async function upsertMoviesToCache(movies, category = null) {
  if (!Array.isArray(movies) || !movies.length) return

  const payload = movies.map((movie) => ({
    tmdb_id: movie.id,
    title: movie.title,
    poster: movie.poster,
    backdrop: movie.backdrop,
    overview: movie.overview,
    release_date: movie.release_date,
    rating: movie.rating,
    type: movie.type,
    category,
    created_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: 'tmdb_id,category,type' })
  if (error) throw error
}
