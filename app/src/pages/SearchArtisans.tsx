import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star, MapPin, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import type { User } from '@/App'
import { useArtisanCategories, useArtisanSearch } from '@/features/artisans/hooks'

interface SearchArtisansProps {
  user: User | null
  logout: () => void
}

export default function SearchArtisans({ user, logout }: SearchArtisansProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const searchFilters = useMemo(() => ({
    query: searchQuery,
    categoryId: selectedCategory,
    location: selectedLocation,
    minRating: selectedRating ? parseFloat(selectedRating) : undefined,
    priceTier: selectedPrice ? (selectedPrice as 'low' | 'medium' | 'high') : undefined,
  }), [searchQuery, selectedCategory, selectedLocation, selectedRating, selectedPrice])

  const { data: categories } = useArtisanCategories()
  const {
    data: filteredArtisans,
    isLoading,
    error,
  } = useArtisanSearch(searchFilters)

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams)

    if (selectedCategory) {
      nextParams.set('category', selectedCategory)
    } else {
      nextParams.delete('category')
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true })
    }
  }, [searchParams, selectedCategory, setSearchParams])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedLocation('')
    setSelectedRating('')
    setSelectedPrice('')
    setSearchParams({})
  }

  const activeFiltersCount = [selectedCategory, selectedLocation, selectedRating, selectedPrice].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#F6F4F2] pb-20 lg:pb-0">
      <Navigation user={user} logout={logout} />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1E1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Find Artisans
            </h1>
            {error ? (
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-red-600">{error}</p>
            ) : (
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#6E5F57]">
                {isLoading ? 'Loading artisans...' : `Browse ${filteredArtisans.length} verified professionals ready to help`}
              </p>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_8px_24px_rgba(43,30,26,0.08)] mb-4 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#6E5F57]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, skill, or service..."
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] placeholder:text-[#6E5F57]/50 focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 transition-all"
                />
              </div>

              {/* Filter Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#2B1E1A]/10 bg-white text-[#2B1E1A] text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-[#E4A14F] text-white text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-3">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F57] pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 cursor-pointer"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ stars</option>
                    <option value="4.7">4.7+ stars</option>
                    <option value="4.9">4.9+ stars</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F57] pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A] focus:outline-none focus:ring-2 focus:ring-[#E4A14F]/50 cursor-pointer"
                  >
                    <option value="">Any Price</option>
                    <option value="low">$35-50/hr</option>
                    <option value="medium">$50-70/hr</option>
                    <option value="high">$70+/hr</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5F57] pointer-events-none" />
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-4 py-3 text-sm text-[#6E5F57] hover:text-[#2B1E1A] transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-3 pt-3 border-t border-[#2B1E1A]/10 grid gap-2 sm:gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A]"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ stars</option>
                  <option value="4.7">4.7+ stars</option>
                  <option value="4.9">4.9+ stars</option>
                </select>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 rounded-lg border border-[#2B1E1A]/10 bg-white text-sm text-[#2B1E1A]"
                >
                  <option value="">Any Price</option>
                  <option value="low">$35-50/hr</option>
                  <option value="medium">$50-70/hr</option>
                  <option value="high">$70+/hr</option>
                </select>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm text-[#6E5F57]"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Grid */}
          {!isLoading && filteredArtisans.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredArtisans.map((artisan) => (
                <Link
                  key={artisan.id}
                  to={`/artisan/${artisan.id}`}
                  className="group bg-white rounded-2xl sm:rounded-[28px] overflow-hidden shadow-[0_18px_40px_rgba(43,30,26,0.08)] hover:shadow-[0_22px_48px_rgba(43,30,26,0.14)] hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-[#E9E1D6] overflow-hidden">
                    <img 
                      src={artisan.image} 
                      alt={artisan.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <h3 className="font-semibold text-[#2B1E1A] text-sm sm:text-base">{artisan.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#E4A14F] text-[#E4A14F]" />
                        <span className="text-xs sm:text-sm font-medium text-[#2B1E1A]">{artisan.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[#6E5F57] mb-1 sm:mb-2">{artisan.category}</p>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-[#6E5F57] mb-2 sm:mb-3">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      {artisan.location}
                    </div>
                    <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-[#2B1E1A]/10">
                      <span className="text-xs sm:text-sm font-medium text-[#E4A14F]">{artisan.priceRange}</span>
                      <span className="text-[10px] sm:text-xs text-[#6E5F57]">{artisan.experience} yrs exp</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl sm:rounded-[28px] overflow-hidden shadow-[0_18px_40px_rgba(43,30,26,0.08)] animate-pulse">
                  <div className="aspect-[4/3] bg-[#E9E1D6]" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-4 bg-[#E9E1D6] rounded" />
                    <div className="h-3 bg-[#E9E1D6] rounded w-2/3" />
                    <div className="h-3 bg-[#E9E1D6] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 mx-auto mb-4 sm:mb-6 rounded-full bg-[#E9E1D6] flex items-center justify-center">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#6E5F57]" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#2B1E1A] mb-2">No artisans found</h3>
              <p className="text-sm sm:text-base text-[#6E5F57] mb-4 sm:mb-6">Try adjusting your filters or search query</p>
              <Button onClick={clearFilters} className="bg-[#E4A14F] hover:bg-[#d09045] text-white rounded-full text-sm sm:text-base">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}