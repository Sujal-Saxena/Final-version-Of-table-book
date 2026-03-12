import { cn } from '@/lib/utils'
import { User } from '@/lib/types'
import { Award, Crown, Medal, Sparkles } from 'lucide-react'

interface LoyaltyBadgeProps {
  tier: User['loyaltyTier']
  discountPercent: number
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const tierConfig = {
  none: {
    label: 'New Member',
    icon: Sparkles,
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
    borderClass: 'border-muted',
  },
  bronze: {
    label: 'Bronze Member',
    icon: Medal,
    bgClass: 'bg-amber-100',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-300',
  },
  silver: {
    label: 'Silver Member',
    icon: Award,
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-300',
  },
  gold: {
    label: 'Gold Member',
    icon: Crown,
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-800',
    borderClass: 'border-yellow-400',
  },
}

export function LoyaltyBadge({
  tier,
  discountPercent,
  showDetails = true,
  size = 'md',
  className,
}: LoyaltyBadgeProps) {
  const config = tierConfig[tier]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        sizeClasses[size],
        config.bgClass,
        config.textClass,
        config.borderClass,
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {showDetails && discountPercent > 0 && (
        <span className="ml-1 font-semibold">
          ({discountPercent}% off)
        </span>
      )}
    </div>
  )
}

export function LoyaltyProgress({ totalBookings }: { totalBookings: number }) {
  const tiers = [
    { name: 'Bronze', minBookings: 2, discount: 5 },
    { name: 'Silver', minBookings: 5, discount: 10 },
    { name: 'Gold', minBookings: 10, discount: 15 },
  ]

  const currentTierIndex = tiers.findIndex((t) => totalBookings < t.minBookings)
  const nextTier = currentTierIndex === -1 ? null : tiers[currentTierIndex]
  const bookingsToNext = nextTier ? nextTier.minBookings - totalBookings : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Total Bookings</span>
        <span className="font-semibold">{totalBookings}</span>
      </div>
      
      {nextTier && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {bookingsToNext} more booking{bookingsToNext !== 1 ? 's' : ''} to {nextTier.name}
            </span>
            <span className="font-medium text-primary">{nextTier.discount}% off</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${Math.min(100, (totalBookings / nextTier.minBookings) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}
      
      {!nextTier && (
        <p className="text-sm text-muted-foreground">
          You have reached the highest tier! Enjoy your 15% discount.
        </p>
      )}
    </div>
  )
}
