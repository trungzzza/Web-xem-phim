import { useEffect, useMemo, useState } from "react"
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
import { categoryMeta, fetchTmdbCategoryPage, type CategoryType } from "@/src/tmdb"

interface CategoryPageProps {
  category: CategoryType
  page: number
  onPageChange: (page: number) => void
  onNavigateHome: () => void
  onOpenMovie: (movieId: number) => void
  onSearch: (keyword: string) => void
  onNavigateCategory: (category: CategoryType) => void
  onNavigateSearchKeyword: (keyword: string) => void
}

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
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

export default function CategoryPage({
  category,
  page,
  onPageChange,
  onNavigateHome,
  onOpenMovie,
  onSearch,
  onNavigateCategory,
  onNavigateSearchKeyword,
}: CategoryPageProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [yearFilter, setYearFilter] = useState("all")

  const tmdbKey = useMemo(() => import.meta.env.VITE_TMDB_API_KEY as string | undefined, [])
  const title = categoryMeta[category].title

  useEffect(() => {
    const loadCategory = async () => {
      if (!tmdbKey) {
        setError("Thiếu VITE_TMDB_API_KEY trong file .env")
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const data = await fetchTmdbCategoryPage({ category, page, apiKey: tmdbKey })
        setAllMovies(data.results)
        setMovies(data.results)
        setTotalPages(Math.min(data.totalPages, 500))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu")
      } finally {
        setIsLoading(false)
      }
    }

    setYearFilter("all")
    loadCategory()
  }, [category, page, tmdbKey])

  useEffect(() => {
    if (yearFilter === "all") {
      setMovies(allMovies)
      return
    }

    const year = Number(yearFilter)
    setMovies(allMovies.filter((movie) => movie.year === year))
  }, [yearFilter, allMovies])

  const yearOptions = useMemo(() => {
    const values = Array.from(new Set(allMovies.map((movie) => movie.year))).sort((a, b) => b - a)
    return values
  }, [allMovies])

  const paginationPages = getPaginationPages(page, totalPages)

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
          <div className="mb-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              <button className="hover:text-foreground" onClick={onNavigateHome}>
                Home
              </button>{" "}
              / Movies / <span className="text-foreground">{title}</span>
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>

              <div className="flex items-center gap-2">
                <label htmlFor="year-filter" className="text-sm text-muted-foreground">
                  Year
                </label>
                <select
                  id="year-filter"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  <option value="all">All</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <section className="space-y-8">
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            {isLoading ? (
              <MovieGridSkeleton />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={onOpenMovie} />
                ))}
              </div>
            )}

            {!isLoading && movies.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">No movies found for this filter.</p>
            )}

            <Pagination className="pt-4">
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

                {paginationPages.map((item, index) => (
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
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
