'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating)
        const partial = index === Math.floor(rating) && rating % 1 !== 0
        const fillPercent = partial ? (rating % 1) * 100 : 0

        return (
          <span
            key={index}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
            onClick={() => handleClick(index)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'text-muted-foreground/30'
              )}
            />
            {(filled || partial) && (
              <Star
                className={cn(
                  sizeClasses[size],
                  'absolute inset-0 text-amber-500 fill-amber-500'
                )}
                style={partial ? { clipPath: `inset(0 ${100 - fillPercent}% 0 0)` } : undefined}
              />
            )}
          </span>
        )
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
