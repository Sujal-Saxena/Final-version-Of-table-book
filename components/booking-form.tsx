'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Restaurant, User, Coupon } from '@/lib/types'
import { 
  getUser, 
  setUser, 
  addBooking, 
  generateBookingId,
  getValidCouponsForEmail,
  validateCoupon,
  useCoupon,
  sendOTP,
  verifyOTP,
  clearOTPSession,
  formatPhoneForDisplay,
} from '@/lib/data/storage'
import { LoyaltyBadge } from '@/components/loyalty-badge'
import { 
  CalendarIcon, 
  Users, 
  Clock, 
  Mail, 
  Percent, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Gift,
  Phone,
  ShieldCheck,
  Loader2,
  RefreshCw,
  CreditCard,
  Smartphone,
  DollarSign,
  Wallet,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  restaurant: Restaurant
}

export function BookingForm({ restaurant }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [time, setTime] = useState<string>('')
  const [partySize, setPartySize] = useState<string>('2')
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [user, setUserState] = useState<User | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null)
  
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])

  const pricePerGuest = 100
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'cash'>('upi')

  useEffect(() => {
    const storedUser = getUser()
    if (storedUser) {
      setUserState(storedUser)
      setEmail(storedUser.email)
      if (storedUser.phone) {
        setPhone(storedUser.phone)
      }
      const coupons = getValidCouponsForEmail(storedUser.email)
      setAvailableCoupons(coupons)
    }
  }, [])

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  useEffect(() => {
    if (date) {
      const dayName = format(date, 'EEEE')
      const hours = restaurant.openingHours.find((h) => h.day === dayName)
      if (hours) {
        const slots = generateTimeSlots(format(date, 'yyyy-MM-dd'), hours.open, hours.close)
        setAvailableSlots(slots)
        if (!slots.includes(time)) {
          setTime('')
        }
      } else {
        setAvailableSlots([])
        setTime('')
      }
    }
  }, [date, restaurant.openingHours, time])

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail)
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
    if (newEmail && newEmail.includes('@')) {
      const userData = setUser(newEmail)
      setUserState(userData)
      const coupons = getValidCouponsForEmail(newEmail)
      setAvailableCoupons(coupons)
    } else {
      setAvailableCoupons([])
    }
  }

  const handlePhoneChange = (newPhone: string) => {
    const cleaned = newPhone.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      setPhone(cleaned)
      if (otpVerified || otpSent) {
        setOtpSent(false)
        setOtpVerified(false)
        setOtp('')
        setOtpError('')
        setGeneratedOtp(null)
        clearOTPSession()
      }
    }
  }

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setOtpError('Please enter a valid 10-digit mobile number')
      return
    }
    
    setSendingOtp(true)
    setOtpError('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const session = sendOTP(phone)
      setOtpSent(true)
      setGeneratedOtp(session.otp)
      setResendTimer(30)
    } catch (error) {
      setOtpError('Failed to send OTP. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP')
      return
    }
    
    setVerifyingOtp(true)
    setOtpError('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = verifyOTP(phone, otp)
      if (result.valid) {
        setOtpVerified(true)
        setOtpError('')
        setGeneratedOtp(null)
      } else {
        setOtpError(result.error || 'Invalid OTP')
      }
    } catch (error) {
      setOtpError('Verification failed. Please try again.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleResendOtp = () => {
    if (resendTimer > 0) return
    setOtp('')
    setOtpError('')
    handleSendOtp()
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    
    if (!email) {
      setCouponError('Please enter your email first')
      return
    }
    
    const result = validateCoupon(couponCode.trim(), email)
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon)
      setCouponError('')
    } else {
      setAppliedCoupon(null)
      setCouponError(result.error || 'Invalid coupon')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const handleSelectAvailableCoupon = (coupon: Coupon) => {
    setCouponCode(coupon.code)
    setAppliedCoupon(coupon)
    setCouponError('')
  }

  const getTotalDiscount = () => {
    const loyaltyDiscount = user?.discountPercent || 0
    const couponDiscount = appliedCoupon?.discountPercent || 0
    const totalDiscount = loyaltyDiscount + couponDiscount
    return totalDiscount > 100 ? 100 : totalDiscount
  }

  const getBasePrice = () => {
    return pricePerGuest * parseInt(partySize)
  }

  const calculateFinalPrice = () => {
    const basePrice = getBasePrice()
    const totalDiscount = getTotalDiscount()
    const discountAmount = (basePrice * totalDiscount) / 100
    return basePrice - discountAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !customerName || !email || !phone || !otpVerified) return

    setIsSubmitting(true)

    try {
      const bookingId = generateBookingId()
      const basePrice = getBasePrice()
      const finalPrice = calculateFinalPrice()
      const booking = {
        id: bookingId,
        restaurantId: restaurant.id,
        userName: customerName,
        userEmail: email,
        userPhone: phone,
        date: format(date, 'yyyy-MM-dd'),
        time,
        partySize: parseInt(partySize),
        status: 'confirmed' as const,
        discount: user?.discountPercent || 0,
        couponCode: appliedCoupon?.code,
        couponDiscount: appliedCoupon?.discountPercent,
        basePrice,
        finalPrice,
        paymentMethod,
        paymentStatus: 'completed' as const,
        createdAt: new Date().toISOString(),
      }

      if (appliedCoupon) {
        useCoupon(appliedCoupon.code)
      }

      addBooking(booking)
      clearOTPSession()
      router.push(`/bookings/${bookingId}`)
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableSizes = restaurant.tables.map((t) => t.size)
  const maxSize = Math.max(...availableSizes)
  const totalDiscount = getTotalDiscount()
  const canSubmit = date && time && customerName && email && phone && otpVerified

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Reserve a Table
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Enter your full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              required
            />
            {user && user.loyaltyTier !== 'none' && (
              <div className="mt-2">
                <LoyaltyBadge
                  tier={user.loyaltyTier}
                  discountPercent={user.discountPercent}
                  size="sm"
                />
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Mobile Number (for OTP verification)
            </Label>
            
            <div className="flex gap-2">
              <div className="flex items-center gap-1 px-3 py-2 bg-muted rounded-md text-sm font-medium">
                +91
              </div>
              <Input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={otpVerified}
                className={cn(
                  "flex-1",
                  otpVerified && "bg-green-50 border-green-200"
                )}
                maxLength={10}
              />
              {!otpSent && !otpVerified && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSendOtp}
                  disabled={phone.length !== 10 || sendingOtp}
                >
                  {sendingOtp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              )}
            </div>

            {otpSent && !otpVerified && generatedOtp && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-sm text-amber-800">
                  <strong>Demo Mode:</strong> Your OTP is <span className="font-mono font-bold text-lg">{generatedOtp}</span>
                  <br />
                  <span className="text-xs">(In production, this would be sent via SMS)</span>
                </AlertDescription>
              </Alert>
            )}

            {otpSent && !otpVerified && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Enter 6-digit OTP sent to {formatPhoneForDisplay(phone)}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtp(val)
                      setOtpError('')
                    }}
                    className="flex-1 text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6 || verifyingOtp}
                  >
                    {verifyingOtp ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className={cn(
                      "flex items-center gap-1 text-primary hover:underline",
                      resendTimer > 0 && "text-muted-foreground cursor-not-allowed hover:no-underline"
                    )}
                  >
                    <RefreshCw className="h-3 w-3" />
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            {otpVerified && (
              <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Mobile number verified: {formatPhoneForDisplay(phone)}
                </span>
              </div>
            )}

            {otpError && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">{otpError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date() || d > addDays(new Date(), 30)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time
            </Label>
            <Select value={time} onValueChange={setTime} disabled={availableSlots.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder={availableSlots.length ? 'Select a time' : 'No slots available'} />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Party Size
            </Label>
            <Select value={partySize} onValueChange={setPartySize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxSize }, (_, i) => i + 1).map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2 border-t">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Coupon Code
            </Label>
            
            {availableCoupons.length > 0 && !appliedCoupon && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Gift className="h-3 w-3" />
                  Your available coupons:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map((coupon) => (
                    <Button
                      key={coupon.code}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSelectAvailableCoupon(coupon)}
                    >
                      {coupon.code} ({coupon.discountPercent}% off)
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {appliedCoupon.code} - {appliedCoupon.discountPercent}% OFF
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase())
                    setCouponError('')
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </Button>
              </div>
            )}
            
            {couponError && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-xs">{couponError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Details
            </Label>
            
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price per Guest</span>
                <span className="font-medium">₹{pricePerGuest.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Number of Guests</span>
                <span className="font-medium">× {partySize}</span>
              </div>
              
              <div className="h-px bg-border" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{getBasePrice().toFixed(2)}</span>
              </div>

              {totalDiscount > 0 && (
                <>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="text-sm">Discount ({totalDiscount}%)</span>
                    <span className="font-semibold">-₹{((getBasePrice() * totalDiscount) / 100).toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-2 border-t-2 border-primary/30">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-lg font-bold text-primary">₹{calculateFinalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </Label>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={cn(
                  'p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition-all',
                  paymentMethod === 'upi'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <Smartphone className="h-5 w-5" />
                <span className="text-xs font-medium">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={cn(
                  'p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition-all',
                  paymentMethod === 'credit_card'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-medium">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('debit_card')}
                className={cn(
                  'p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition-all',
                  paymentMethod === 'debit_card'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs font-medium">Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={cn(
                  'p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition-all',
                  paymentMethod === 'wallet'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <Wallet className="h-5 w-5" />
                <span className="text-xs font-medium">Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={cn(
                  'p-3 border-2 rounded-lg flex flex-col items-center gap-1 transition-all',
                  paymentMethod === 'cash'
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-muted-foreground/50'
                )}
              >
                <DollarSign className="h-5 w-5" />
                <span className="text-xs font-medium">Cash</span>
              </button>
            </div>
          </div>

          {totalDiscount > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Percent className="h-4 w-4 text-primary" />
                <span>Discount Summary</span>
              </div>
              <div className="text-xs space-y-1 text-muted-foreground">
                {user && user.discountPercent > 0 && (
                  <div className="flex justify-between">
                    <span>Loyalty discount ({user.loyaltyTier})</span>
                    <span>{user.discountPercent}%</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>{appliedCoupon.discountPercent}%</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-foreground pt-1 border-t">
                  <span>Total discount</span>
                  <span>{totalDiscount}% OFF</span>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : !otpVerified && phone.length === 10 ? (
              'Verify mobile to continue'
            ) : (
              'Complete Reservation'
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Book now and receive a coupon code via email for your next visit!
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

function generateTimeSlots(date: string, startHour: string, endHour: string): string[] {
  const slots: string[] = []
  const [startH] = startHour.split(':').map(Number)
  const [endH] = endHour.split(':').map(Number)

  for (let i = startH; i < endH; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`)
    slots.push(`${i.toString().padStart(2, '0')}:30`)
  }

  return slots
}
