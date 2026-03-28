import { ChevronRight } from "lucide-react"
import { MovieCard, type Movie } from "@/components/movie-card"

interface MovieSectionProps {
  id?: string
  title: string
  movies: Movie[]
  onSeeMore?: () => void
  onMovieClick?: (movieId: number) => void
}

export function MovieSection({ id, title, movies, onSeeMore, onMovieClick }: MovieSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={onSeeMore}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Xem thêm
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  )
}
