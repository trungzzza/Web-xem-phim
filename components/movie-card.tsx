"use client"

import { Play } from "lucide-react"

export interface Movie {
  id: number
  title: string
  subtitle?: string
  year: number
  rating?: number
  episodes?: number
  badge?: string
  badgeType?: "hd" | "new" | "episode"
  posterUrl: string
}

interface MovieCardProps {
  movie: Movie
  onClick?: (movieId: number) => void
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const getBadgeStyles = (type?: string) => {
    switch (type) {
      case "hd":
        return "bg-gradient-to-r from-primary to-orange-400 text-primary-foreground"
      case "new":
        return "bg-gradient-to-r from-accent to-cyan-400 text-accent-foreground"
      case "episode":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  return (
    <article className="group relative transition-all duration-300 hover:-translate-y-1">
      <a
        href={`#/movie/${movie.id}`}
        className="block"
        onClick={(e) => {
          if (!onClick) return
          e.preventDefault()
          onClick(movie.id)
        }}
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-card shadow-md group-hover:shadow-2xl">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {movie.badge && (
            <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg ${getBadgeStyles(movie.badgeType)}`}>
              {movie.badge}
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          {movie.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {movie.subtitle}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{movie.year}</span>
            {typeof movie.rating === "number" && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{movie.rating.toFixed(1)}★</span>
              </>
            )}
            {movie.episodes && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{movie.episodes} Episodes</span>
              </>
            )}
          </div>
        </div>
      </a>
    </article>
  )
}
