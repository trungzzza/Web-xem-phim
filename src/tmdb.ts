import type { Movie } from "@/components/movie-card"

export type CategoryType = "popular" | "tv-series" | "new-movies"

type TmdbItem = {
  id: number
  title?: string
  name?: string
  release_date?: string
  first_air_date?: string
  vote_average?: number
  poster_path?: string | null
  genre_ids?: number[]
}

type TmdbListResponse = {
  page: number
  total_pages: number
  results: TmdbItem[]
}

const TMDB_BASE = "https://api.themoviedb.org/3"
const TMDB_IMAGE = "https://image.tmdb.org/t/p/w500"

export const categoryMeta: Record<CategoryType, { title: string; endpoint: string }> = {
  popular: {
    title: "Popular Movies",
    endpoint: "/movie/popular",
  },
  "tv-series": {
    title: "TV Series",
    endpoint: "/tv/popular",
  },
  "new-movies": {
    title: "New Movies",
    endpoint: "/discover/movie",
  },
}

function mapToMovieCard(item: TmdbItem, category: CategoryType): Movie {
  const date = item.release_date || item.first_air_date || ""
  const year = Number.parseInt(date.slice(0, 4), 10) || new Date().getFullYear()
  const rating = Number(item.vote_average || 0)

  return {
    id: item.id,
    title: item.title || item.name || "Untitled",
    subtitle: rating ? `Rating: ${rating.toFixed(1)}` : undefined,
    year,
    rating,
    badge: category === "new-movies" ? "New" : "HD",
    badgeType: category === "new-movies" ? "new" : "hd",
    posterUrl: item.poster_path ? `${TMDB_IMAGE}${item.poster_path}` : "/placeholder.jpg",
  }
}

export async function fetchTmdbCategoryPage({
  category,
  page,
  apiKey,
}: {
  category: CategoryType
  page: number
  apiKey: string
}) {
  const endpoint = categoryMeta[category].endpoint
  const params = new URLSearchParams({
    api_key: apiKey,
    language: "en-US",
    page: String(page),
  })

  if (category === "new-movies") {
    params.set("sort_by", "release_date.desc")
    params.set("include_adult", "false")
  }

  const response = await fetch(`${TMDB_BASE}${endpoint}?${params.toString()}`)
  if (!response.ok) throw new Error("Không thể tải dữ liệu TMDB")

  const data: TmdbListResponse = await response.json()

  return {
    page: data.page,
    totalPages: data.total_pages,
    results: (data.results || []).map((item) => mapToMovieCard(item, category)),
    rawResults: data.results || [],
  }
}
