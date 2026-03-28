import { supabase } from '../config/supabase.js'

const TABLE = 'search_history'

export async function saveSearchKeyword(keyword) {
  const { error } = await supabase.from(TABLE).insert({ keyword })
  if (error) throw error
}

export async function getSearchSuggestions(q, limit = 10) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('keyword')
    .ilike('keyword', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(limit * 3)

  if (error) throw error

  const unique = []
  const seen = new Set()

  for (const row of data || []) {
    const key = row.keyword.trim().toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(row.keyword)
    if (unique.length >= limit) break
  }

  return unique
}
