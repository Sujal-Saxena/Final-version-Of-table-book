'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { LoyaltyBadge, LoyaltyProgress } from '@/components/loyalty-badge'
import { Booking, User, Coupon, CancellationReason } from '@/lib/types'
import { getBookingsByEmail, getUser, setUser, cancelBooking, calculateRefundAmount, getValidCouponsForEmail } from '@/lib/data/storage'
import { getRestaurantById } from '@/lib/data/restaurants'
import { format, isPast, parseISO, formatDistanceToNow } from 'date-fns'
import { 
  CalendarDays, 
  Clock, 
  Users, 
  MapPin, 
  Search, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Tag,
  Gift,
  Copy,
  Phone,
  AlertTriangle,
  IndianRupee,
  Info,
  RefreshCcw,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CANCELLATION_REASONS: CancellationReason[] = [
  'Change of plans',
  'Found a better option',
  'Emergency',
  'Weather conditions',
  'Health issues',
  'Restaurant issue',
  'Other'
]

export default function BookingsPage() {
  const [email, setEmail] = useState('')
  const [user, setUserState] = useState<User | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = getUser()
    if (storedUser) {
      setEmail(storedUser.email)
      loadBookings(storedUser.email)
    }
  }, [])

  const loadBookings = (emailToSearch: string) => {
    const userBookings = getBookingsByEmail(emailToSearch)
    setBookings(userBookings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
    const userData = setUser(emailToSearch)
    setUserState(userData)
    const userCoupons = getValidCouponsForEmail(emailToSearch)
    setCoupons(userCoupons)
    setHasSearched(true)
  }

  // Cancellation state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancellationReason, setCancellationReason] = useState<CancellationReason>('Change of plans')
  const [additionalComments, setAdditionalComments] = useState('')
  const [refundInfo, setRefundInfo] = useState<{ amount: number; percentage: number; message: string } | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [cancelledBookingInfo, setCancelledBookingInfo] = useState<{ booking: Booking; refund: number } | null>(null)

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      loadBookings(email.trim())
    }
  }

  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    const refund = calculateRefundAmount(booking)
    setRefundInfo(refund)
    setCancellationReason('Change of plans')
    setAdditionalComments('')
    setCancelDialogOpen(true)
  }

  const handleCancelBooking = () => {
    if (!selectedBooking || !refundInfo) return
    
    setIsCancelling(true)
    
    // Simulate a brief processing delay
    setTimeout(() => {
      const cancelledBooking = cancelBooking({
        bookingId: selectedBooking.id,
        reason: cancellationReason,
        refundAmount: refundInfo.amount
      })
      
      if (cancelledBooking) {
        setCancelledBookingInfo({ booking: cancelledBooking, refund: refundInfo.amount })
        setCancelDialogOpen(false)
        setShowSuccessDialog(true)
        loadBookings(email)
      }
      
      setIsCancelling(false)
    }, 1000)
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && !isPast(parseISO(`${b.date}T${b.time}`))
  )
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || (b.status === 'confirmed' && isPast(parseISO(`${b.date}T${b.time}`)))
  )
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Bookings</h1>
        <p className="text-muted-foreground mb-8">
          View and manage your restaurant reservations
        </p>

        {/* Email Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email to view bookings"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit">View Bookings</Button>
            </form>
          </CardContent>
        </Card>

        {/* Loyalty Status */}
        {user && hasSearched && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Loyalty Status</span>
                <LoyaltyBadge
                  tier={user.loyaltyTier}
                  discountPercent={user.discountPercent}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoyaltyProgress totalBookings={user.totalBookings} />
            </CardContent>
          </Card>
        )}

        {/* Available Coupons */}
        {coupons.length > 0 && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Your Coupon Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use these coupon codes on your next booking for extra discounts!
              </p>
              <div className="grid gap-3">
                {coupons.map((coupon) => (
                  <div 
                    key={coupon.code}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-mono font-semibold">{coupon.code}</p>
                        <p className="text-xs text-muted-foreground">
                          {coupon.discountPercent}% off - Valid until {format(parseISO(coupon.validUntil), 'MMM d, yyyy')}
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
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Coupon codes are sent to your email after each booking. Book more to earn more coupons!
              </p>
            </CardContent>
          </Card>
        )}

        {hasSearched && bookings.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">No bookings found</p>
            <p className="text-sm text-muted-foreground mb-6">
              Make your first reservation and start earning loyalty rewards!
            </p>
            <Link href="/restaurants">
              <Button>Browse Restaurants</Button>
            </Link>
          </div>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Upcoming Reservations
            </h2>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={openCancelDialog}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Past Reservations
            </h2>
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isPast />
              ))}
            </div>
          </section>
        )}

        {/* Cancelled Bookings */}
        {cancelledBookings.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Cancelled Reservations
            </h2>
            <div className="space-y-4">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isCancelled />
              ))}
            </div>
          </section>
        )}

        {/* Cancellation Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Cancel Reservation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this reservation? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && refundInfo && (
              <div className="space-y-6 py-4">
                {/* Booking Summary */}
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="font-medium">{getRestaurantById(selectedBooking.restaurantId)?.name}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {format(parseISO(selectedBooking.date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedBooking.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {selectedBooking.partySize} guests
                    </span>
                  </div>
                </div>

                {/* Refund Information */}
                <div className={cn(
                  "p-4 rounded-lg border-2",
                  refundInfo.percentage === 100 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : refundInfo.percentage > 0
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                )}>
                  <div className="flex items-start gap-3">
                    <IndianRupee className={cn(
                      "h-5 w-5 mt-0.5",
                      refundInfo.percentage === 100 
                        ? "text-green-600 dark:text-green-400"
                        : refundInfo.percentage > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    )} />
                    <div>
                      <p className={cn(
                        "font-semibold",
                        refundInfo.percentage === 100 
                          ? "text-green-700 dark:text-green-300"
                          : refundInfo.percentage > 0
                            ? "text-amber-700 dark:text-amber-300"
                            : "text-red-700 dark:text-red-300"
                      )}>
                        Refund: {refundInfo.percentage}% (₹{refundInfo.amount.toFixed(2)})
                      </p>
                      <p className={cn(
                        "text-sm",
                        refundInfo.percentage === 100 
                          ? "text-green-600 dark:text-green-400"
                          : refundInfo.percentage > 0
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                      )}>
                        {refundInfo.message}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Cancellation Reason */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Reason for cancellation</Label>
                  <RadioGroup 
                    value={cancellationReason} 
                    onValueChange={(val) => setCancellationReason(val as CancellationReason)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {CANCELLATION_REASONS.map((reason) => (
                      <div key={reason} className="flex items-center space-x-2">
                        <RadioGroupItem value={reason} id={reason} />
                        <Label htmlFor={reason} className="text-sm font-normal cursor-pointer">
                          {reason}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Additional Comments */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Additional comments <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    placeholder="Tell us more about why you're cancelling..."
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Cancellation Policy */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-medium">Cancellation Policy:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>24+ hours before: 100% refund</li>
                        <li>12-24 hours before: 75% refund</li>
                        <li>6-12 hours before: 50% refund</li>
                        <li>2-6 hours before: 25% refund</li>
                        <li>Less than 2 hours: No refund</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
                disabled={isCancelling}
              >
                Keep Reservation
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelBooking}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <>
                    <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancellation Success Dialog */}
        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <AlertDialogTitle className="text-center">Booking Cancelled</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                {cancelledBookingInfo && (
                  <div className="space-y-2">
                    <p>Your reservation has been successfully cancelled.</p>
                    {cancelledBookingInfo.refund > 0 && (
                      <p className="font-medium text-foreground">
                        A refund of ₹{cancelledBookingInfo.refund.toFixed(2)} will be processed within 5-7 business days.
                      </p>
                    )}
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
                Done
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

interface BookingCardProps {
  booking: Booking
  isPast?: boolean
  isCancelled?: boolean
  onCancel?: (booking: Booking) => void
}

function BookingCard({ booking, isPast, isCancelled, onCancel }: BookingCardProps) {
  const restaurant = getRestaurantById(booking.restaurantId)
  
  if (!restaurant) return null

  const bookingDate = parseISO(booking.date)
  const formattedDate = format(bookingDate, 'EEEE, MMMM d, yyyy')

  return (
    <Card className={cn(
      'transition-colors',
      isCancelled && 'opacity-60',
      isPast && 'bg-muted/50'
    )}>
      <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-lg">{restaurant.name}</h3>
              {booking.discount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {booking.discount}% loyalty
                </Badge>
              )}
              {booking.couponCode && booking.couponDiscount && (
                <Badge variant="outline" className="text-xs border-primary text-primary">
                  {booking.couponDiscount}% coupon ({booking.couponCode})
                </Badge>
              )}
            </div>

            {booking.userName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">{booking.userName}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {booking.time}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                {booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {restaurant.location}
              </div>
              {booking.userPhone && (
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Phone className="h-4 w-4" />
                  +91 {booking.userPhone.slice(0, 5)} {booking.userPhone.slice(5)}
                </div>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground">
              Booking ID: {booking.id}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:items-end">
            {!isPast && !isCancelled && (
              <>
                <Link href={`/restaurants/${restaurant.id}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    View Restaurant
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onCancel?.(booking)}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel Booking
                </Button>
              </>
            )}
            {isPast && (
              <Link href={`/restaurants/${restaurant.id}`}>
                <Button variant="outline" size="sm">
                  Book Again
                </Button>
              </Link>
            )}
            {isCancelled && (
              <div className="flex flex-col gap-2 sm:items-end">
                <Badge variant="outline" className="text-destructive border-destructive">
                  Cancelled
                </Badge>
                {booking.cancelledAt && (
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(booking.cancelledAt), { addSuffix: true })}
                  </p>
                )}
                {booking.refundAmount && booking.refundAmount > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" />
                    Refund: ₹{booking.refundAmount.toFixed(2)}
                    {booking.refundStatus && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {booking.refundStatus}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
