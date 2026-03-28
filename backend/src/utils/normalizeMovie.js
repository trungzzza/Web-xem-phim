export function normalizeMovie(item, typeHint = 'movie') {
  const isTv = item?.media_type === 'tv' || typeHint === 'tv'

  return {
    id: item?.id,
    title: isTv ? item?.name || item?.title || '' : item?.title || item?.name || '',
    poster: item?.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
    backdrop: item?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : null,
    overview: item?.overview || '',
    release_date: isTv ? item?.first_air_date || null : item?.release_date || null,
    rating: item?.vote_average || 0,
    type: isTv ? 'tv' : 'movie',
  }
}

export function mapCacheRowToMovie(row) {
  return {
    id: row.tmdb_id,
    title: row.title,
    poster: row.poster,
    backdrop: row.backdrop,
    overview: row.overview,
    release_date: row.release_date,
    rating: row.rating,
    type: row.type,
  }
}
