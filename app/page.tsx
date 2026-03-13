import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RestaurantCard } from '@/components/restaurant-card'
import { RatingStars } from '@/components/rating-stars'
import { getFeaturedRestaurants, getTopRatedRestaurants, getAllCuisines } from '@/lib/data/restaurants'
import { Search, Award, Percent, CalendarCheck, ChevronRight, UtensilsCrossed } from 'lucide-react'

export default function HomePage() {
  const featuredRestaurants = getFeaturedRestaurants()
  const topRated = getTopRatedRestaurants()
  const cuisines = getAllCuisines().slice(0, 8)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6 text-balance">
              Find Your Perfect
              <span className="text-primary block mt-2">Dining in Aligarh</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Discover exceptional restaurants in Aligarh, Uttar Pradesh. Book tables instantly and earn coupon rewards with every reservation.
            </p>
            
            <form action="/restaurants" method="GET" className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search restaurants, cuisines, locations..."
                  className="pl-12 h-12 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Search
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {cuisines.map((cuisine) => (
                <Link key={cuisine} href={`/restaurants?cuisine=${encodeURIComponent(cuisine)}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                    {cuisine}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Instant Booking</h3>
                <p className="text-sm text-muted-foreground">
                  Reserve your table in seconds with real-time availability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Top-Rated Venues</h3>
                <p className="text-sm text-muted-foreground">
                  Curated selection of the best restaurants in Aligarh.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Coupon Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Get exclusive coupon codes via email for repeat visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Top Rated</h2>
            <p className="text-muted-foreground">The highest-rated restaurants by our community</p>
          </div>
          <Link href="/restaurants?sort=rating">
            <Button variant="ghost" className="gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRated.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">Featured Restaurants</h2>
              <p className="text-muted-foreground">Hand-picked dining destinations</p>
            </div>
            <Link href="/restaurants">
              <Button variant="ghost" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 md:p-12 text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Join Our Loyalty Program
            </h2>
            <p className="text-primary-foreground/90 mb-6">
              Book more, save more. Our loyalty program rewards you with increasing discounts:
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-center gap-3">
                <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">Bronze</Badge>
                <span>2+ bookings = 5% off</span>
              </li>
              <li className="flex items-center gap-3">
                <Badge className="bg-primary-foreground/30 text-primary-foreground border-0">Silver</Badge>
                <span>5+ bookings = 10% off</span>
              </li>
              <li className="flex items-center gap-3">
                <Badge className="bg-primary-foreground/40 text-primary-foreground border-0">Gold</Badge>
                <span>10+ bookings = 15% off</span>
              </li>
            </ul>
            <Link href="/restaurants">
              <Button variant="secondary" size="lg">
                Start Booking Now
              </Button>
            </Link>
          </div>
          
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <UtensilsCrossed className="w-64 h-64" />
          </div>
        </div>
      </section>

      {/* Browse by Cuisine */}
      <section className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">
            Browse by Cuisine
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {getAllCuisines().map((cuisine) => (
              <Link
                key={cuisine}
                href={`/restaurants?cuisine=${encodeURIComponent(cuisine)}`}
                className="group p-6 bg-background rounded-xl border border-border hover:border-primary hover:shadow-md transition-all text-center"
              >
                <span className="font-medium group-hover:text-primary transition-colors">
                  {cuisine}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
