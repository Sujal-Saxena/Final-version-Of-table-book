'use client'

import { Suspense, useEffect, useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoyaltyBadge } from '@/components/loyalty-badge'
import { Booking, Coupon } from '@/lib/types'
import { getBookingById, getUser, getValidCouponsForEmail } from '@/lib/data/storage'
import { getRestaurantById } from '@/lib/data/restaurants'
import { format, parseISO } from 'date-fns'
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  Percent,
  UtensilsCrossed,
  Home,
  CalendarPlus,
  Tag,
  Gift,
  Copy,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Smartphone,
  Wallet,
  User,
} from 'lucide-react'

interface BookingConfirmationPageProps {
  params: Promise<{ id: string }>
}

function BookingConfirmationContent({ params }: BookingConfirmationPageProps) {
  const { id } = use(params)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const loadBooking = () => {
      const foundBooking = getBookingById(id)
      setBooking(foundBooking || null)

      if (foundBooking) {
        const userCoupons = getValidCouponsForEmail(foundBooking.userEmail)
        setCoupons(userCoupons)
      }

      setIsLoading(false)
    }

    loadBooking()
  }, [id])

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    notFound()
  }

  const restaurant = getRestaurantById(booking.restaurantId)

  if (!restaurant) {
    notFound()
  }

  const bookingDate = parseISO(booking.date)
  const formattedDate = format(bookingDate, 'EEEE, MMMM d, yyyy')
  const user = getUser()
  const totalDiscount = (booking.discount || 0) + (booking.couponDiscount || 0)

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Dinner at ${restaurant.name}`)}&dates=${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00/${booking.date.replace(/-/g, '')}T${booking.time.replace(':', '')}00&details=${encodeURIComponent(`Reservation for ${booking.partySize} at ${restaurant.name}`)}&location=${encodeURIComponent(restaurant.address)}`

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your table has been reserved at {restaurant.name}
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                {restaurant.name}
              </CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Confirmed
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Guest Name</p>
                <p className="font-medium">{booking.userName || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{booking.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Party Size</p>
                <p className="font-medium">
                  {booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{restaurant.address}</p>
              </div>
            </div>

            {totalDiscount > 0 && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">
                    {totalDiscount}% Total Discount Applied
                  </span>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">

          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <CalendarPlus className="h-4 w-4" />
              Add to Calendar
            </Button>
          </a>

          <Link href="/bookings" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <CalendarDays className="h-4 w-4" />
              View All Bookings
            </Button>
          </Link>

          <Link href="/" className="flex-1">
            <Button className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

        </div>

      </div>
    </div>
  )
}

export default function BookingConfirmationPage(props: BookingConfirmationPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 text-center">
          Loading booking confirmation...
        </div>
      }
    >
      <BookingConfirmationContent {...props} />
    </Suspense>
  )
}