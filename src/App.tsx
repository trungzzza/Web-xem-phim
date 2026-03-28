import { useEffect, useMemo, useState } from "react"
import HomePage from "./HomePage"
import CategoryPage from "./CategoryPage"
import MovieDetailPage from "./MovieDetailPage"
import SearchPage from "./SearchPage"
import type { CategoryType } from "@/src/tmdb"

const validCategories: CategoryType[] = ["popular", "tv-series", "new-movies"]
type ViewType = "home" | "category" | "movie" | "search"

type RouteState = {
  view: ViewType
  category: CategoryType
  page: number
  movieId: number | null
  keyword: string
}

function readStateFromUrl(): RouteState {
  const movieMatch = window.location.pathname.match(/^\/movie\/(\d+)$/)
  if (movieMatch) {
    return {
      view: "movie",
      category: "popular",
      page: 1,
      movieId: Number.parseInt(movieMatch[1], 10),
      keyword: "",
    }
  }

  const params = new URLSearchParams(window.location.search)
  const searchKeyword = (params.get("q") || "").trim()
  const searchPage = Number.parseInt(params.get("page") || "1", 10)

  if (searchKeyword) {
    return {
      view: "search",
      category: "popular",
      page: Number.isNaN(searchPage) ? 1 : Math.max(1, searchPage),
      movieId: null,
      keyword: searchKeyword,
    }
  }

  const categoryParam = params.get("category")
  const pageParam = Number.parseInt(params.get("page") || "1", 10)

  const isCategory = categoryParam && validCategories.includes(categoryParam as CategoryType)
  if (!isCategory) {
    return {
      view: "home",
      category: "popular",
      page: 1,
      movieId: null,
      keyword: "",
    }
  }

  return {
    view: "category",
    category: categoryParam as CategoryType,
    page: Number.isNaN(pageParam) ? 1 : Math.max(1, pageParam),
    movieId: null,
    keyword: "",
  }
}

function writeStateToUrl(
  view: ViewType,
  category: CategoryType,
  page: number,
  movieId?: number,
  keyword?: string,
) {
  if (view === "movie" && movieId) {
    window.history.pushState({}, "", `/movie/${movieId}`)
    return
  }

  if (view === "home") {
    window.history.pushState({}, "", "/")
    return
  }

  if (view === "search") {
    const params = new URLSearchParams()
    params.set("q", keyword || "")
    params.set("page", String(page))
    window.history.pushState({}, "", `/?${params.toString()}`)
    return
  }

  const params = new URLSearchParams()
  params.set("category", category)
  params.set("page", String(page))
  window.history.pushState({}, "", `/?${params.toString()}`)
}

export default function App() {
  const initialRouteState = useMemo(readStateFromUrl, [])
  const [view, setView] = useState<ViewType>(initialRouteState.view)
  const [category, setCategory] = useState<CategoryType>(initialRouteState.category)
  const [page, setPage] = useState(initialRouteState.page)
  const [movieId, setMovieId] = useState<number | null>(initialRouteState.movieId)
  const [keyword, setKeyword] = useState(initialRouteState.keyword)

  useEffect(() => {
    const onPopState = () => {
      const next = readStateFromUrl()
      setView(next.view)
      setCategory(next.category)
      setPage(next.page)
      setMovieId(next.movieId)
      setKeyword(next.keyword)
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [view, category, page])

  const handleSeeMore = (nextCategory: CategoryType) => {
    setCategory(nextCategory)
    setPage(1)
    setView("category")
    setMovieId(null)
    setKeyword("")
    writeStateToUrl("category", nextCategory, 1)
  }

  const handleSearch = (nextKeyword: string) => {
    setKeyword(nextKeyword)
    setPage(1)
    setMovieId(null)
    setView("search")
    writeStateToUrl("search", category, 1, undefined, nextKeyword)
  }

  const handleNavigateCategory = (nextCategory: CategoryType) => {
    setCategory(nextCategory)
    setPage(1)
    setMovieId(null)
    setKeyword("")
    setView("category")
    writeStateToUrl("category", nextCategory, 1)
  }

  const handleNavigateSearchKeyword = (nextKeyword: string) => {
    handleSearch(nextKeyword)
  }

  const handleNavigateHome = () => {
    setView("home")
    setPage(1)
    setMovieId(null)
    setKeyword("")
    writeStateToUrl("home", category, 1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    if (view === "search") {
      writeStateToUrl("search", category, nextPage, undefined, keyword)
      return
    }

    writeStateToUrl("category", category, nextPage)
  }

  const handleOpenMovie = (nextMovieId: number) => {
    setMovieId(nextMovieId)
    setView("movie")
    writeStateToUrl("movie", category, page, nextMovieId)
  }

  const handleMovieBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    setView("home")
    setMovieId(null)
    writeStateToUrl("home", category, 1)
  }

  if (view === "category") {
    return (
      <CategoryPage
        category={category}
        page={page}
        onPageChange={handlePageChange}
        onNavigateHome={handleNavigateHome}
        onOpenMovie={handleOpenMovie}
        onSearch={handleSearch}
        onNavigateCategory={handleNavigateCategory}
        onNavigateSearchKeyword={handleNavigateSearchKeyword}
      />
    )
  }

  if (view === "movie" && movieId) {
    return (
      <MovieDetailPage
        movieId={movieId}
        onBack={handleMovieBack}
        onOpenMovie={handleOpenMovie}
        onSearch={handleSearch}
        onNavigateHome={handleNavigateHome}
        onNavigateCategory={handleNavigateCategory}
        onNavigateSearchKeyword={handleNavigateSearchKeyword}
      />
    )
  }

  if (view === "search") {
    return (
      <SearchPage
        keyword={keyword}
        page={page}
        onPageChange={handlePageChange}
        onOpenMovie={handleOpenMovie}
        onSearch={handleSearch}
        onNavigateHome={handleNavigateHome}
        onNavigateCategory={handleNavigateCategory}
        onNavigateSearchKeyword={handleNavigateSearchKeyword}
      />
    )
  }

  return (
    <HomePage
      onSeeMore={handleSeeMore}
      onOpenMovie={handleOpenMovie}
      onSearch={handleSearch}
      onNavigateHome={handleNavigateHome}
      onNavigateSearchKeyword={handleNavigateSearchKeyword}
    />
  )
}
