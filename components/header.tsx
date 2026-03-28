"use client"

import { useState } from "react"
import { Search, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CategoryType } from "@/src/tmdb"

const navItems = [
  { label: "Trang chủ", action: "home" as const },
  { label: "Thể loại", action: "categories" as const },
  { label: "Quốc gia", action: "countries" as const },
  { label: "Phổ biến", action: "movies" as const },
  { label: "Phim bộ", action: "tv-series" as const },
  { label: "Hoạt hình", action: "anime" as const },
]

type NavAction = (typeof navItems)[number]["action"]

const categoryDropdownItems: Array<
  { label: string; type: "category"; value: CategoryType } | { label: string; type: "search"; value: string }
> = [
  { label: "Phim hành động", type: "search", value: "phim-hanh-dong" },
  { label: "Phim kinh dị", type: "search", value: "phim-kinh-di" },
  { label: "Phim viễn tưởng", type: "search", value: "phim-vien-tuong" },
  { label: "Phim tình cảm", type: "search", value: "phim-tinh-cam" },
  { label: "Phim võ thuật", type: "search", value: "phim-vo-thuat" },
  { label: "Phim hoạt hình", type: "search", value: "phim-hoat-hinh" },
  { label: "Phim cổ trang", type: "search", value: "phim-co-trang" },
  { label: "Phim tài liệu", type: "search", value: "phim-tai-lieu" },
  { label: "Phim thể thao", type: "search", value: "phim-the-thao" },
]

const countryDropdownItems: Array<{ label: string; value: string }> = [
  { label: "Phim Trung Quốc", value: "phim-trung-quoc" },
  { label: "Phim Mỹ", value: "phim-my" },
  { label: "Phim Hàn Quốc", value: "phim-han-quoc" },
  { label: "Phim Nhật Bản", value: "phim-nhat-ban" },
  { label: "Phim Hồng Kông", value: "phim-hong-kong" },
  { label: "Phim Thái Lan", value: "phim-thai-lan" },
  { label: "Phim Ấn Độ", value: "phim-an-do" },
  { label: "Phim Đài Loan", value: "phim-dai-loan" },
  { label: "Phim Anh", value: "phim-anh" },
  { label: "Phim Việt Nam", value: "phim-viet-nam" },
]

interface HeaderProps {
  onSearch?: (keyword: string) => void
  onNavigateHome?: () => void
  onNavigateCategory?: (category: CategoryType) => void
  onNavigateSearchKeyword?: (keyword: string) => void
}

export function Header({
  onSearch,
  onNavigateHome,
  onNavigateCategory,
  onNavigateSearchKeyword,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [mobileCountriesOpen, setMobileCountriesOpen] = useState(false)
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false)
  const [desktopCountriesOpen, setDesktopCountriesOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [keyword, setKeyword] = useState("")

  const submitSearch = (value: string) => {
    const q = value.trim()
    if (!q || !onSearch) return
    onSearch(q)
  }

  const handleCategoryPick = (item: (typeof categoryDropdownItems)[number]) => {
    if (item.type === "category") {
      onNavigateCategory?.(item.value)
    } else {
      onNavigateSearchKeyword?.(item.value)
    }

    setDesktopCategoriesOpen(false)
    setDesktopCountriesOpen(false)
    setMobileCategoriesOpen(false)
    setMobileCountriesOpen(false)
    setMobileMenuOpen(false)
  }

  const handleCountryPick = (item: (typeof countryDropdownItems)[number]) => {
    onNavigateSearchKeyword?.(item.value)

    setDesktopCategoriesOpen(false)
    setDesktopCountriesOpen(false)
    setMobileCategoriesOpen(false)
    setMobileCountriesOpen(false)
    setMobileMenuOpen(false)
  }

  const handleNavAction = (action: NavAction) => {
    switch (action) {
      case "home":
        onNavigateHome?.()
        break
      case "categories":
        setDesktopCategoriesOpen((prev) => !prev)
        setMobileCategoriesOpen((prev) => !prev)
        return
      case "countries":
        setDesktopCountriesOpen((prev) => !prev)
        setMobileCountriesOpen((prev) => !prev)
        return
      case "movies":
        onNavigateCategory?.("popular")
        break
      case "tv-series":
        onNavigateCategory?.("tv-series")
        break
      case "anime":
        onNavigateSearchKeyword?.("anime")
        break
      default:
        break
    }

    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo thương hiệu */}
          <button
            type="button"
            onClick={() => onNavigateHome?.()}
            className="flex items-center gap-2 shrink-0"
          >
            <img src="/logo.png" alt="logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold text-foreground hidden sm:block">
              T-Movies
            </span>
          </button>

          {/* Menu desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.action === "categories" ? (
                <div
                  key={item.label}
                  className="relative pb-1"
                  onMouseEnter={() => setDesktopCategoriesOpen(true)}
                  onMouseLeave={() => setDesktopCategoriesOpen(false)}
                >
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                  >
                    {item.label}
                  </button>

                  {desktopCategoriesOpen && (
                    <div className="absolute left-0 top-full pt-1">
                      <div className="w-56 rounded-xl border border-border bg-card p-2 shadow-2xl">
                        {categoryDropdownItems.map((dropdownItem) => (
                          <button
                            key={dropdownItem.label}
                            type="button"
                            onClick={() => handleCategoryPick(dropdownItem)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                          >
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : item.action === "countries" ? (
                <div
                  key={item.label}
                  className="relative pb-1"
                  onMouseEnter={() => setDesktopCountriesOpen(true)}
                  onMouseLeave={() => setDesktopCountriesOpen(false)}
                >
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                  >
                    {item.label}
                  </button>

                  {desktopCountriesOpen && (
                    <div className="absolute left-0 top-full pt-1">
                      <div className="w-56 rounded-xl border border-border bg-card p-2 shadow-2xl">
                        {countryDropdownItems.map((dropdownItem) => (
                          <button
                            key={dropdownItem.label}
                            type="button"
                            onClick={() => handleCountryPick(dropdownItem)}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                          >
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavAction(item.action)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                >
                  {item.label}
                </button>
              )
            ))}
          </nav>

          {/* Ô tìm kiếm và thao tác */}
          <div className="flex items-center gap-3">
            <form
              className={`relative hidden sm:block transition-all duration-300 ${searchFocused ? 'w-72' : 'w-56'}`}
              onSubmit={(e) => {
                e.preventDefault()
                submitSearch(keyword)
              }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movie..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </form>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Nút mở menu mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleNavAction(item.action)}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>

                  {item.action === "categories" && mobileCategoriesOpen && (
                    <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
                      {categoryDropdownItems.map((dropdownItem) => (
                        <button
                          key={dropdownItem.label}
                          type="button"
                          onClick={() => handleCategoryPick(dropdownItem)}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {item.action === "countries" && mobileCountriesOpen && (
                    <div className="ml-2 mt-1 space-y-1 border-l border-border pl-2">
                      {countryDropdownItems.map((dropdownItem) => (
                        <button
                          key={dropdownItem.label}
                          type="button"
                          onClick={() => handleCountryPick(dropdownItem)}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 sm:hidden">
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault()
                  submitSearch(keyword)
                }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search movie..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </form>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
