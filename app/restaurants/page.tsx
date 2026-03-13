'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { RestaurantCard } from '@/components/restaurant-card'
import { SearchFilters } from '@/components/search-filters'
import { restaurants } from '@/lib/data/restaurants'
import { FilterState, SortOption, CuisineType } from '@/lib/types'

function RestaurantsContent() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    cuisine: [],
    priceRange: [],
    minRating: 0,
    search: '',
  })

  const [sort, setSort] = useState<SortOption>('rating')

  // Initialize filters from URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search') || ''
    const cuisineParam = searchParams.get('cuisine')
    const sortParam = searchParams.get('sort') as SortOption | null

    setFilters((prev) => ({
      ...prev,
      search: searchQuery,
      cuisine: cuisineParam ? [cuisineParam as CuisineType] : prev.cuisine,
    }))

    if (sortParam) {
      setSort(sortParam)
    }
  }, [searchParams])

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.cuisine.some((c) => c.toLowerCase().includes(searchLower)) ||
          r.location.toLowerCase().includes(searchLower)
      )
    }

    // Cuisine filter
    if (filters.cuisine.length > 0) {
      result = result.filter((r) =>
        r.cuisine.some((c) => filters.cuisine.includes(c as CuisineType))
      )
    }

    // Price filter
    if (filters.priceRange.length > 0) {
      result = result.filter((r) => filters.priceRange.includes(r.priceRange))
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((r) => r.rating >= filters.minRating)
    }

    // Sorting
    switch (sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        result.sort((a, b) => a.priceRange - b.priceRange)
        break
      case 'price-high':
        result.sort((a, b) => b.priceRange - a.priceRange)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [filters, sort])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
          Restaurants
        </h1>
        <p className="text-muted-foreground">
          Discover and book tables at {restaurants.length} amazing restaurants
        </p>
      </div>

      <SearchFilters
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
      />

      <div className="mt-8">
        {filteredRestaurants.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Showing {filteredRestaurants.length} restaurant
              {filteredRestaurants.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">
              No restaurants found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading restaurants...</div>}>
      <RestaurantsContent />
    </Suspense>
  )
}