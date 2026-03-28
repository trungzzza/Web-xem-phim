import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard, type Movie } from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { CategoryType } from "@/src/tmdb"

interface SearchPageProps {
  keyword: string
  page: number
  onPageChange: (page: number) => void
  onOpenMovie: (movieId: number) => void
  onSearch: (keyword: string) => void
  onNavigateHome: () => void
  onNavigateCategory: (category: CategoryType) => void
  onNavigateSearchKeyword: (keyword: string) => void
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const CATEGORY_LABELS: Record<string, string> = {
  "phim-hanh-dong": "Phim hành động",
  "phim-kinh-di": "Phim kinh dị",
  "phim-vien-tuong": "Phim viễn tưởng",
  "phim-tinh-cam": "Phim tình cảm",
  "phim-vo-thuat": "Phim võ thuật",
  "phim-hoat-hinh": "Phim hoạt hình",
  "phim-co-trang": "Phim cổ trang",
  "phim-tai-lieu": "Phim tài liệu",
  "phim-the-thao": "Phim thể thao",
}

const COUNTRY_LABELS: Record<string, string> = {
  "phim-trung-quoc": "Phim Trung Quốc",
  "phim-my": "Phim Mỹ",
  "phim-han-quoc": "Phim Hàn Quốc",
  "phim-nhat-ban": "Phim Nhật Bản",
  "phim-hong-kong": "Phim Hồng Kông",
  "phim-thai-lan": "Phim Thái Lan",
  "phim-an-do": "Phim Ấn Độ",
  "phim-dai-loan": "Phim Đài Loan",
  "phim-anh": "Phim Anh",
  "phim-viet-nam": "Phim Việt Nam",
}

type SearchApiMovie = {
  id: number
  title: string
  poster: string | null
  release_date: string | null
  rating: number
  type: "movie" | "tv"
}

function getPaginationPages(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push("ellipsis")
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (end < total - 1) pages.push("ellipsis")
  pages.push(total)

  return pages
}

function toMovieCard(item: SearchApiMovie): Movie {
  const year = item.release_date ? Number.parseInt(item.release_date.slice(0, 4), 10) : new Date().getFullYear()

  return {
    id: item.id,
    title: item.title,
    subtitle: item.type === "tv" ? "TV Series" : "Movie",
    year,
    rating: Number(item.rating || 0),
    badge: item.type === "tv" ? "Series" : "HD",
    badgeType: item.type === "tv" ? "episode" : "hd",
    posterUrl: item.poster || "/placeholder.jpg",
  }
}

export default function SearchPage({
  keyword,
  page,
  onPageChange,
  onOpenMovie,
  onSearch,
  onNavigateHome,
  onNavigateCategory,
  onNavigateSearchKeyword,
}: SearchPageProps) {
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const loadSearch = async () => {
      if (!keyword.trim()) {
        setResults([])
        setTotalPages(1)
        setTotalResults(0)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const normalizedKeyword = keyword.trim().toLowerCase()
        const categoryLabel = CATEGORY_LABELS[normalizedKeyword]
        const countryLabel = COUNTRY_LABELS[normalizedKeyword]

        const endpoint = categoryLabel
          ? `${API_BASE}/api/search/category?category=${encodeURIComponent(normalizedKeyword)}&page=${page}`
          : countryLabel
            ? `${API_BASE}/api/search/country?country=${encodeURIComponent(normalizedKeyword)}&page=${page}`
            : `${API_BASE}/api/search?q=${encodeURIComponent(keyword)}&page=${page}`

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error("Không thể tìm kiếm phim")
        }

        const data = await response.json()
        setResults((data.results || []).map(toMovieCard))
        setTotalPages(Math.max(1, Math.min(data.total_pages || 1, 500)))
        setTotalResults(data.total_results || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi")
      } finally {
        setIsLoading(false)
      }
    }

    loadSearch()
  }, [keyword, page])

  const pages = getPaginationPages(page, totalPages)
  const currentCategoryLabel = CATEGORY_LABELS[keyword.trim().toLowerCase()]
  const currentCountryLabel = COUNTRY_LABELS[keyword.trim().toLowerCase()]

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={onSearch}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onNavigateCategory}
        onNavigateSearchKeyword={onNavigateSearchKeyword}
      />

      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Search Results</h1>
            <p className="text-sm text-muted-foreground">
              {currentCategoryLabel ? (
                <>
                  Category: <span className="text-foreground">"{currentCategoryLabel}"</span> • {totalResults} results
                </>
              ) : currentCountryLabel ? (
                <>
                  Country: <span className="text-foreground">"{currentCountryLabel}"</span> • {totalResults} results
                </>
              ) : (
                <>
                  Keyword: <span className="text-foreground">"{keyword}"</span> • {totalResults} results
                </>
              )}
            </p>
          </div>

          {error && (
            <p className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={onOpenMovie} />
                ))}
              </div>

              {!results.length && (
                <p className="pt-8 text-center text-sm text-muted-foreground">No movies found.</p>
              )}

              <Pagination className="pt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page > 1) onPageChange(page - 1)
                      }}
                    />
                  </PaginationItem>

                  {pages.map((item, index) => (
                    <PaginationItem key={`${item}-${index}`}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={item === page}
                          onClick={(e) => {
                            e.preventDefault()
                            onPageChange(item)
                          }}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page < totalPages) onPageChange(page + 1)
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
