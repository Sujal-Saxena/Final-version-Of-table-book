import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RatingStars } from '@/components/rating-stars'
import { Restaurant } from '@/lib/types'
import { MapPin, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RestaurantCardProps {
  restaurant: Restaurant
  className?: string
}

function PriceRange({ range }: { range: number }) {
  return (
    <span className="flex items-center text-muted-foreground">
      {Array.from({ length: 4 }).map((_, i) => (
        <DollarSign
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < range ? 'text-foreground' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </span>
  )
}

export function RestaurantCard({ restaurant, className }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className={cn(
        'overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer h-full',
        className
      )}>
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {restaurant.images && restaurant.images[0] ? (
            <Image
              src={restaurant.images[0]}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            >
              <span className="text-4xl font-serif text-primary/40">
                {restaurant.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div className="flex flex-wrap gap-1.5">
              {restaurant.cuisine.slice(0, 2).map((c) => (
                <Badge key={c} variant="secondary" className="bg-background/90 text-xs">
                  {c}
                </Badge>
              ))}
            </div>
            {restaurant.featured && (
              <Badge className="bg-accent text-accent-foreground text-xs">
                Featured
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <RatingStars rating={restaurant.rating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({restaurant.reviewCount})
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {restaurant.description}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{restaurant.location}</span>
            </div>
            <PriceRange range={restaurant.priceRange} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
