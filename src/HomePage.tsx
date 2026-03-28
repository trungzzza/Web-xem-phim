import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { MovieSection } from "@/components/movie-section"
import { Footer } from "@/components/footer"
import type { Movie } from "@/components/movie-card"
import { fetchTmdbCategoryPage, type CategoryType } from "@/src/tmdb"

interface HomePageProps {
  onSeeMore: (category: CategoryType) => void
  onOpenMovie: (movieId: number) => void
  onSearch: (keyword: string) => void
  onNavigateHome: () => void
  onNavigateSearchKeyword: (keyword: string) => void
}

export default function HomePage({
  onSeeMore,
  onOpenMovie,
  onSearch,
  onNavigateHome,
  onNavigateSearchKeyword,
}: HomePageProps) {
  const [newMovies, setNewMovies] = useState<Movie[]>([])
  const [tvSeries, setTvSeries] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tmdbKey = useMemo(() => import.meta.env.VITE_TMDB_API_KEY as string | undefined, [])

  useEffect(() => {
    const fetchMovies = async () => {
      if (!tmdbKey) {
        setError("Thiếu VITE_TMDB_API_KEY trong file .env")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const [newData, tvData, popularData] = await Promise.all([
          fetchTmdbCategoryPage({ category: "new-movies", page: 1, apiKey: tmdbKey }),
          fetchTmdbCategoryPage({ category: "tv-series", page: 1, apiKey: tmdbKey }),
          fetchTmdbCategoryPage({ category: "popular", page: 1, apiKey: tmdbKey }),
        ])

        setNewMovies(newData.results.slice(0, 6))
        setTvSeries(tvData.results.slice(0, 6))
        setPopularMovies(popularData.results.slice(0, 6))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu phim")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [tmdbKey])

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={onSearch}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onSeeMore}
        onNavigateSearchKeyword={onNavigateSearchKeyword}
      />

      <main className="pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-12">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary/20 via-accent/10 to-transparent">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&h=400&fit=crop')] bg-cover bg-center opacity-30" />
              <div className="relative px-8 py-16 sm:py-20 lg:py-24">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                  Khám phá mới lạ
                  <span className="text-primary"> tận hưởng đỉnh cao giải trí</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mb-6 leading-relaxed">
                  Xem hàng ngàn phim điện ảnh, phim truyền hình và phim hoạt hình chất lượng HD.
                  Nội dung mới được cập nhật mỗi ngày.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#new-movies"
                    className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Tìm kiếm phim mới
                  </a>
                  <a
                    href="#tv-series"
                    className="px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    Xem phim dài tập
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-16">
            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            {isLoading && (
              <p className="text-sm text-muted-foreground">Đang tải phim từ TMDB...</p>
            )}

            <MovieSection
              id="new-movies"
              title="New Movies"
              movies={newMovies}
              onSeeMore={() => onSeeMore("new-movies")}
              onMovieClick={onOpenMovie}
            />

            <MovieSection
              id="tv-series"
              title="TV Series"
              movies={tvSeries}
              onSeeMore={() => onSeeMore("tv-series")}
              onMovieClick={onOpenMovie}
            />

            <MovieSection
              id="movies"
              title="Popular Movies"
              movies={popularMovies}
              onSeeMore={() => onSeeMore("popular")}
              onMovieClick={onOpenMovie}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
