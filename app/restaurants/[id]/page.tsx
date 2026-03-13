import { Suspense } from "react"
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RatingStars } from '@/components/rating-stars'
import { BookingForm } from '@/components/booking-form'
import { Reviews } from '@/components/reviews'
import { getRestaurantById, restaurants } from '@/lib/data/restaurants'
import { MapPin, Clock, DollarSign, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
  }))
}

interface RestaurantPageProps {
  params: Promise<{ id: string }>
}

function PriceRange({ range }: { range: number }) {
  return (
    <span className="flex items-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <DollarSign
          key={i}
          className={cn(
            "h-4 w-4",
            i < range ? "text-foreground" : "text-muted-foreground/30"
          )}
        />
      ))}
    </span>
  )
}

async function RestaurantPageContent({ params }: RestaurantPageProps) {
  const { id } = await params
  const restaurant = getRestaurantById(id)

  if (!restaurant) {
    notFound()
  }

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const todayHours = restaurant.openingHours.find((h) => h.day === today)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[450px] overflow-hidden">
        {restaurant.images && restaurant.images[0] ? (
          <Image
            src={restaurant.images[0]}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-[200px] font-serif text-primary/10">
              {restaurant.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 pb-6">
          <Link href="/restaurants">
            <Button variant="ghost" size="sm" className="mb-4 -ml-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Restaurants
            </Button>
          </Link>

          <div className="flex flex-wrap gap-2 mb-3">
            {restaurant.cuisine.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2">
            {restaurant.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <RatingStars rating={restaurant.rating} showValue />
              <span className="text-muted-foreground">
                ({restaurant.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {restaurant.location}
            </div>

            <PriceRange range={restaurant.priceRange} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Reviews restaurantId={restaurant.id} />
      </div>
    </div>
  )
}

export default function RestaurantPage(props: RestaurantPageProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <RestaurantPageContent {...props} />
    </Suspense>
  )
}