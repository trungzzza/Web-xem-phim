import { useEffect, useMemo, useState } from "react"
import { X, Play } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MovieCard, type Movie } from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTmdbCategoryPage, type CategoryType } from "@/src/tmdb"

type MovieDetail = {
  id: number
  title: string
  poster: string | null
  backdrop: string | null
  overview: string
  release_date: string | null
  rating: number
  type: "movie" | "tv"
  genres?: string[]
  runtime?: number
}

interface MovieDetailPageProps {
  movieId: number
  onBack: () => void
  onOpenMovie: (movieId: number) => void
  onSearch: (keyword: string) => void
  onNavigateHome: () => void
  onNavigateCategory: (category: CategoryType) => void
  onNavigateSearchKeyword: (keyword: string) => void
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

const getYear = (date?: string | null) => (date ? Number.parseInt(date.slice(0, 4), 10) : null)

function DetailSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <Skeleton className="h-[420px] w-full rounded-2xl" />
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <Skeleton className="aspect-[2/3] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
        </div>
      </div>
    </div>
  )
}

export default function MovieDetailPage({
  movieId,
  onBack,
  onOpenMovie,
  onSearch,
  onNavigateHome,
  onNavigateCategory,
  onNavigateSearchKeyword,
}: MovieDetailPageProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const tmdbKey = useMemo(() => import.meta.env.VITE_TMDB_API_KEY as string | undefined, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [movieRes, trailerRes] = await Promise.all([
          fetch(`${API_BASE}/api/movies/${movieId}`),
          fetch(`${API_BASE}/api/movies/${movieId}/trailer`),
        ])

        if (!movieRes.ok) throw new Error("Không thể tải chi tiết phim")
        const movieJson = await movieRes.json()
        const trailerJson = trailerRes.ok ? await trailerRes.json() : { trailerKey: null }

        setMovie(movieJson.data)
        setTrailerKey(trailerJson.trailerKey || null)

        if (tmdbKey) {
          const related = await fetchTmdbCategoryPage({
            category: movieJson.data?.type === "tv" ? "tv-series" : "popular",
            page: 1,
            apiKey: tmdbKey,
          })

          setRelatedMovies(related.results.filter((item) => item.id !== movieId).slice(0, 12))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [movieId, tmdbKey])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header
        onSearch={onSearch}
        onNavigateHome={onNavigateHome}
        onNavigateCategory={onNavigateCategory}
        onNavigateSearchKeyword={onNavigateSearchKeyword}
      />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <DetailSkeleton />
          ) : error || !movie ? (
            <p className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">{error || "Movie not found"}</p>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-500">
              <section className="relative overflow-hidden rounded-2xl min-h-[360px] lg:min-h-[440px]">
                <img
                  src={movie.backdrop || "/placeholder.jpg"}
                  alt={`${movie.title} backdrop`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                <div className="relative z-10 flex h-full items-end p-6 sm:p-8 lg:p-10">
                  <div className="max-w-2xl space-y-4">
                    <button onClick={onBack} className="text-sm text-slate-300 hover:text-white">
                      ← Back
                    </button>
                    <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{movie.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
                      <span>{getYear(movie.release_date) || "N/A"}</span>
                      <span className="inline-flex items-center gap-1">⭐ {movie.rating?.toFixed(1) || "0.0"}</span>
                    </div>

                    <p className="line-clamp-3 max-w-2xl text-sm text-slate-200 sm:text-base">{movie.overview}</p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => trailerKey && setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!trailerKey}
                      >
                        <Play className="h-4 w-4" /> Xem giới thiệu
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-400/40 bg-slate-800/40 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/50"
                      >
                        + Add to Favorites
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
                <div>
                  <img
                    src={movie.poster || "/placeholder.jpg"}
                    alt={`${movie.title} poster`}
                    className="w-full rounded-xl shadow-2xl"
                  />
                </div>

                <div className="space-y-5">
                  <h2 className="text-3xl font-bold">{movie.title}</h2>
                  <p className="text-slate-300 leading-relaxed">{movie.overview}</p>

                  <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                    <p>
                      <span className="text-slate-400">Release date:</span> {movie.release_date || "N/A"}
                    </p>
                    <p>
                      <span className="text-slate-400">Rating:</span> ⭐ {movie.rating?.toFixed(1) || "0.0"}
                    </p>
                    <p>
                      <span className="text-slate-400">Runtime:</span> {movie.runtime ? `${movie.runtime} min` : "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {(movie.genres || []).map((genre) => (
                      <span key={genre} className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs text-slate-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h3 className="text-2xl font-bold">Bạn có thể thích</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
                  {relatedMovies.map((related) => (
                    <MovieCard key={related.id} movie={related} onClick={onOpenMovie} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {isModalOpen && trailerKey && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 p-2 text-white hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Movie Trailer"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
