'use client'

import { Booking, Review, User, Coupon, OTPSession, Complaint, Feedback } from '@/lib/types'
import { initialReviews } from './restaurants'

const BOOKINGS_KEY = 'tablebook_bookings'
const REVIEWS_KEY = 'tablebook_reviews'
const USER_KEY = 'tablebook_user'
const COUPONS_KEY = 'tablebook_coupons'
const OTP_KEY = 'tablebook_otp'
const COMPLAINTS_KEY = 'tablebook_complaints'
const FEEDBACK_KEY = 'tablebook_feedback'

// Initialize reviews with mock data if empty
function initializeReviews(): Review[] {
  if (typeof window === 'undefined') return initialReviews
  
  const stored = localStorage.getItem(REVIEWS_KEY)
  if (!stored) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews))
    return initialReviews
  }
  return JSON.parse(stored)
}

// Bookings
export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(BOOKINGS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getBookingsByEmail(email: string): Booking[] {
  return getBookings().filter((b) => b.userEmail.toLowerCase() === email.toLowerCase())
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id)
}

export function addBooking(booking: Booking): void {
  const bookings = getBookings()
  bookings.push(booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  
  // Update user loyalty
  updateUserLoyalty(booking.userEmail)
  
  // Generate coupon for repeated customers (after 2nd booking)
  const userBookings = getBookingsByEmail(booking.userEmail).filter(b => b.status !== 'cancelled')
  if (userBookings.length >= 2) {
    generateCouponForUser(booking.userEmail, userBookings.length)
  }
}

export function updateBookingStatus(id: string, status: Booking['status']): void {
  const bookings = getBookings()
  const index = bookings.findIndex((b) => b.id === id)
  if (index !== -1) {
    bookings[index].status = status
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  }
}

export interface CancelBookingParams {
  bookingId: string
  reason: string
  refundAmount: number
}

export function cancelBooking(params: CancelBookingParams): Booking | null {
  const bookings = getBookings()
  const index = bookings.findIndex((b) => b.id === params.bookingId)
  
  if (index === -1) return null
  
  const booking = bookings[index]
  booking.status = 'cancelled'
  booking.cancelledAt = new Date().toISOString()
  booking.cancellationReason = params.reason as Booking['cancellationReason']
  booking.refundAmount = params.refundAmount
  booking.refundStatus = params.refundAmount > 0 ? 'pending' : undefined
  booking.paymentStatus = params.refundAmount > 0 ? 'refunded' : booking.paymentStatus
  
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
  
  return booking
}

export function calculateRefundAmount(booking: Booking): { amount: number; percentage: number; message: string } {
  const bookingDateTime = new Date(`${booking.date}T${booking.time}`)
  const now = new Date()
  const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  // Cancellation policy:
  // - More than 24 hours: 100% refund
  // - 12-24 hours: 75% refund
  // - 6-12 hours: 50% refund
  // - 2-6 hours: 25% refund
  // - Less than 2 hours: No refund
  
  if (hoursUntilBooking >= 24) {
    return {
      amount: booking.finalPrice,
      percentage: 100,
      message: 'Full refund - cancelled more than 24 hours before reservation'
    }
  } else if (hoursUntilBooking >= 12) {
    const amount = booking.finalPrice * 0.75
    return {
      amount: Math.round(amount * 100) / 100,
      percentage: 75,
      message: '75% refund - cancelled 12-24 hours before reservation'
    }
  } else if (hoursUntilBooking >= 6) {
    const amount = booking.finalPrice * 0.5
    return {
      amount: Math.round(amount * 100) / 100,
      percentage: 50,
      message: '50% refund - cancelled 6-12 hours before reservation'
    }
  } else if (hoursUntilBooking >= 2) {
    const amount = booking.finalPrice * 0.25
    return {
      amount: Math.round(amount * 100) / 100,
      percentage: 25,
      message: '25% refund - cancelled 2-6 hours before reservation'
    }
  } else {
    return {
      amount: 0,
      percentage: 0,
      message: 'No refund - cancelled less than 2 hours before reservation'
    }
  }
}

// Reviews
export function getReviews(): Review[] {
  if (typeof window === 'undefined') return initialReviews
  return initializeReviews()
}

export function getReviewsByRestaurant(restaurantId: string): Review[] {
  return getReviews().filter((r) => r.restaurantId === restaurantId)
}

export function addReview(review: Review): void {
  const reviews = getReviews()
  reviews.push(review)
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

export function hasUserReviewedRestaurant(email: string, restaurantId: string): boolean {
  return getReviews().some(
    (r) => r.userEmail.toLowerCase() === email.toLowerCase() && r.restaurantId === restaurantId
  )
}

export function hasUserBookedRestaurant(email: string, restaurantId: string): boolean {
  return getBookings().some(
    (b) =>
      b.userEmail.toLowerCase() === email.toLowerCase() &&
      b.restaurantId === restaurantId &&
      (b.status === 'confirmed' || b.status === 'completed')
  )
}

// User & Loyalty
export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(USER_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setUser(email: string): User {
  const bookings = getBookingsByEmail(email)
  const totalBookings = bookings.filter((b) => b.status !== 'cancelled').length
  
  const user: User = {
    email,
    totalBookings,
    ...calculateLoyaltyTier(totalBookings),
  }
  
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function clearUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(USER_KEY)
}

export function updateUserLoyalty(email: string): User {
  return setUser(email)
}

export function calculateLoyaltyTier(totalBookings: number): {
  loyaltyTier: User['loyaltyTier']
  discountPercent: number
} {
  if (totalBookings >= 10) {
    return { loyaltyTier: 'gold', discountPercent: 15 }
  } else if (totalBookings >= 5) {
    return { loyaltyTier: 'silver', discountPercent: 10 }
  } else if (totalBookings >= 2) {
    return { loyaltyTier: 'bronze', discountPercent: 5 }
  }
  return { loyaltyTier: 'none', discountPercent: 0 }
}

export function calculateAverageRating(restaurantId: string): number {
  const reviews = getReviewsByRestaurant(restaurantId)
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

// Coupons
export function getCoupons(): Coupon[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(COUPONS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getCouponsByEmail(email: string): Coupon[] {
  return getCoupons().filter(
    (c) => c.email.toLowerCase() === email.toLowerCase() && !c.used
  )
}

export function getValidCouponsForEmail(email: string): Coupon[] {
  const now = new Date().toISOString()
  return getCouponsByEmail(email).filter(
    (c) => !c.used && c.validUntil > now
  )
}

export function getCouponByCode(code: string): Coupon | undefined {
  return getCoupons().find((c) => c.code.toUpperCase() === code.toUpperCase())
}

export function validateCoupon(code: string, email: string): { valid: boolean; coupon?: Coupon; error?: string } {
  const coupon = getCouponByCode(code)
  
  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' }
  }
  
  if (coupon.email.toLowerCase() !== email.toLowerCase()) {
    return { valid: false, error: 'This coupon is not valid for your email' }
  }
  
  if (coupon.used) {
    return { valid: false, error: 'This coupon has already been used' }
  }
  
  const now = new Date()
  const validUntil = new Date(coupon.validUntil)
  if (now > validUntil) {
    return { valid: false, error: 'This coupon has expired' }
  }
  
  return { valid: true, coupon }
}

export function useCoupon(code: string): void {
  const coupons = getCoupons()
  const index = coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase())
  if (index !== -1) {
    coupons[index].used = true
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons))
  }
}

export function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'ALG'
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function generateCouponForUser(email: string, bookingCount: number): Coupon {
  // Calculate discount based on booking count
  let discountPercent = 5
  if (bookingCount >= 10) {
    discountPercent = 20
  } else if (bookingCount >= 5) {
    discountPercent = 15
  } else if (bookingCount >= 3) {
    discountPercent = 10
  }
  
  // Valid for 30 days
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)
  
  const coupon: Coupon = {
    code: generateCouponCode(),
    email,
    discountPercent,
    validUntil: validUntil.toISOString(),
    used: false,
    createdAt: new Date().toISOString(),
  }
  
  const coupons = getCoupons()
  coupons.push(coupon)
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons))
  
  return coupon
}

// Time slots
export function generateTimeSlots(date: string, openTime: string, closeTime: string): string[] {
  const slots: string[] = []
  const [openHour, openMin] = openTime.split(':').map(Number)
  const [closeHour, closeMin] = closeTime.split(':').map(Number)
  
  const today = new Date()
  const selectedDate = new Date(date)
  const isToday = selectedDate.toDateString() === today.toDateString()
  
  let currentHour = openHour
  let currentMin = openMin
  
  while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`
    
    // If today, only show future slots
    if (isToday) {
      const slotTime = new Date(selectedDate)
      slotTime.setHours(currentHour, currentMin, 0, 0)
      if (slotTime > today) {
        slots.push(timeString)
      }
    } else {
      slots.push(timeString)
    }
    
    currentMin += 30
    if (currentMin >= 60) {
      currentMin = 0
      currentHour += 1
    }
  }
  
  return slots
}

export function generateBookingId(): string {
  return `BK${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

// OTP Functions
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function sendOTP(phone: string): OTPSession {
  const otp = generateOTP()
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 5) // OTP valid for 5 minutes
  
  const session: OTPSession = {
    phone,
    otp,
    expiresAt: expiresAt.toISOString(),
    verified: false,
  }
  
  // Store OTP session
  localStorage.setItem(OTP_KEY, JSON.stringify(session))
  
  // In a real app, this would send an SMS via Twilio/MSG91/etc.
  // For demo purposes, we'll show the OTP in an alert
  console.log(`[OTP] Sending OTP ${otp} to ${phone}`)
  
  return session
}

export function getOTPSession(): OTPSession | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(OTP_KEY)
  return stored ? JSON.parse(stored) : null
}

export function verifyOTP(phone: string, enteredOTP: string): { valid: boolean; error?: string } {
  const session = getOTPSession()
  
  if (!session) {
    return { valid: false, error: 'No OTP session found. Please request a new OTP.' }
  }
  
  if (session.phone !== phone) {
    return { valid: false, error: 'Phone number mismatch. Please request a new OTP.' }
  }
  
  const now = new Date()
  const expiresAt = new Date(session.expiresAt)
  if (now > expiresAt) {
    return { valid: false, error: 'OTP has expired. Please request a new OTP.' }
  }
  
  if (session.otp !== enteredOTP) {
    return { valid: false, error: 'Invalid OTP. Please try again.' }
  }
  
  // Mark as verified
  session.verified = true
  localStorage.setItem(OTP_KEY, JSON.stringify(session))
  
  return { valid: true }
}

export function isPhoneVerified(phone: string): boolean {
  const session = getOTPSession()
  return session !== null && session.phone === phone && session.verified
}

export function clearOTPSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(OTP_KEY)
}

export function formatPhoneForDisplay(phone: string): string {
  // Format: +91 XXXXX XXXXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Complaints
export function getComplaints(): Complaint[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(COMPLAINTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getComplaintsByEmail(email: string): Complaint[] {
  return getComplaints().filter((c) => c.userEmail.toLowerCase() === email.toLowerCase())
}

export function getComplaintById(id: string): Complaint | undefined {
  return getComplaints().find((c) => c.id === id)
}

export function addComplaint(complaint: Complaint): void {
  const complaints = getComplaints()
  complaints.push(complaint)
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints))
}

export function generateComplaintId(): string {
  return `CP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

// Feedback
export function getFeedback(): Feedback[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(FEEDBACK_KEY)
  return stored ? JSON.parse(stored) : []
}

export function getFeedbackByEmail(email: string): Feedback[] {
  return getFeedback().filter((f) => f.userEmail.toLowerCase() === email.toLowerCase())
}

export function getFeedbackById(id: string): Feedback | undefined {
  return getFeedback().find((f) => f.id === id)
}

export function addFeedback(feedback: Feedback): void {
  const feedbacks = getFeedback()
  feedbacks.push(feedback)
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks))
}

export function generateFeedbackId(): string {
  return `FB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}
