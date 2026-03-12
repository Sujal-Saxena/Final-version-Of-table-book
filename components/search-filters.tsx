'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { FilterState, SortOption, CuisineType } from '@/lib/types'
import { getAllCuisines } from '@/lib/data/restaurants'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  filters: FilterState
  sort: SortOption
  onFiltersChange: (filters: FilterState) => void
  onSortChange: (sort: SortOption) => void
}

export function SearchFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
}: SearchFiltersProps) {
  const [cuisines, setCuisines] = useState<string[]>([])
  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    setCuisines(getAllCuisines())
  }, [])

  useEffect(() => {
    setLocalSearch(filters.search)
  }, [filters.search])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltersChange({ ...filters, search: localSearch })
  }

  const toggleCuisine = (cuisine: CuisineType) => {
    const newCuisines = filters.cuisine.includes(cuisine)
      ? filters.cuisine.filter((c) => c !== cuisine)
      : [...filters.cuisine, cuisine]
    onFiltersChange({ ...filters, cuisine: newCuisines })
  }

  const clearFilters = () => {
    onFiltersChange({
      cuisine: [],
      priceRange: [],
      minRating: 0,
      search: '',
    })
    setLocalSearch('')
  }

  const hasActiveFilters =
    filters.cuisine.length > 0 ||
    filters.priceRange.length > 0 ||
    filters.minRating > 0 ||
    filters.search !== ''

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Cuisine</h4>
                  <div className="flex flex-wrap gap-2">
                    {cuisines.map((cuisine) => (
                      <Badge
                        key={cuisine}
                        variant={filters.cuisine.includes(cuisine as CuisineType) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleCuisine(cuisine as CuisineType)}
                      >
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((price) => (
                      <Button
                        key={price}
                        variant={filters.priceRange.includes(price) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const newPrices = filters.priceRange.includes(price)
                            ? filters.priceRange.filter((p) => p !== price)
                            : [...filters.priceRange, price]
                          onFiltersChange({ ...filters, priceRange: newPrices })
                        }}
                      >
                        {'$'.repeat(price)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Minimum Rating: {filters.minRating || 'Any'}</h4>
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={([value]) => onFiltersChange({ ...filters, minRating: value })}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Any</span>
                    <span>5 Stars</span>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" className="w-full" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  onFiltersChange({ ...filters, search: '' })
                  setLocalSearch('')
                }}
              />
            </Badge>
          )}
          {filters.cuisine.map((c) => (
            <Badge key={c} variant="secondary" className="gap-1">
              {c}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleCuisine(c)}
              />
            </Badge>
          ))}
          {filters.priceRange.map((p) => (
            <Badge key={p} variant="secondary" className="gap-1">
              {'$'.repeat(p)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    priceRange: filters.priceRange.filter((pr) => pr !== p),
                  })
                }
              />
            </Badge>
          ))}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="gap-1">
              {filters.minRating}+ stars
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, minRating: 0 })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
