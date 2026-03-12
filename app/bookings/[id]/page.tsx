'use client'

import { useEffect, useState, use } from 'react'
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

export default function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
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

        {/* Booking Details Card */}
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
          <CardContent className="pt-6">
            <div className="grid gap-4">
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
                <div className="p-3 bg-primary/10 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-primary" />
                    <span className="font-medium text-primary">
                      {totalDiscount}% Total Discount Applied
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1 pl-7">
                    {booking.discount > 0 && (
                      <p>Loyalty discount: {booking.discount}%</p>
                    )}
                    {booking.couponCode && booking.couponDiscount && (
                      <p>Coupon ({booking.couponCode}): {booking.couponDiscount}%</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price and Payment Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Base Price</span>
                  <span className="font-semibold">₹{booking.basePrice.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">Discount ({totalDiscount}%)</span>
                    <span className="font-semibold">-₹{(booking.basePrice - booking.finalPrice).toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-border" />
                <div className="flex justify-between items-center pt-2 border-t-2 border-primary/30">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-lg font-bold text-primary">₹{booking.finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  {booking.paymentMethod === 'upi' && <Smartphone className="h-5 w-5 text-primary" />}
                  {booking.paymentMethod === 'credit_card' && <CreditCard className="h-5 w-5 text-primary" />}
                  {booking.paymentMethod === 'debit_card' && <CreditCard className="h-5 w-5 text-primary" />}
                  {booking.paymentMethod === 'wallet' && <Wallet className="h-5 w-5 text-primary" />}
                  {booking.paymentMethod === 'cash' && <DollarSign className="h-5 w-5 text-primary" />}
                  
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {booking.paymentMethod === 'credit_card' ? 'Credit Card' : 
                       booking.paymentMethod === 'debit_card' ? 'Debit Card' :
                       booking.paymentMethod === 'upi' ? 'UPI' :
                       booking.paymentMethod === 'wallet' ? 'Digital Wallet' : 'Cash'}
                    </p>
                  </div>
                  
                  <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                    {booking.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Reference */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="font-mono font-semibold text-lg">{booking.id}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {booking.userEmail}
                </div>
                {booking.userPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +91 {booking.userPhone.slice(0, 5)} {booking.userPhone.slice(5)}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coupon Generated */}
        {coupons.length > 0 && (
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5 text-primary" />
                Your Reward Coupon!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Thank you for being a loyal customer! Here are your coupon codes for future bookings:
              </p>
              <div className="space-y-3">
                {coupons.slice(0, 2).map((coupon) => (
                  <div 
                    key={coupon.code}
                    className="flex items-center justify-between p-4 bg-background rounded-lg border-2 border-dashed border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="h-6 w-6 text-primary" />
                      <div>
                        <p className="font-mono font-bold text-lg">{coupon.code}</p>
                        <p className="text-sm text-muted-foreground">
                          {coupon.discountPercent}% OFF - Valid until {format(parseISO(coupon.validUntil), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className="gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Coupon details have been sent to your email. Use them on your next booking!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loyalty Status */}
        {user && user.loyaltyTier !== 'none' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Your Loyalty Status</span>
                <LoyaltyBadge
                  tier={user.loyaltyTier}
                  discountPercent={user.discountPercent}
                />
              </div>
            </CardContent>
          </Card>
        )}

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
