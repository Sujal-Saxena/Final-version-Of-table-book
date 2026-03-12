export interface Restaurant {
  id: string
  name: string
  description: string
  cuisine: string[]
  location: string
  address: string
  priceRange: 1 | 2 | 3 | 4
  images: string[]
  rating: number
  reviewCount: number
  openingHours: { day: string; open: string; close: string }[]
  tables: { size: number; count: number }[]
  featured?: boolean
}

export type CancellationReason = 
  | 'Change of plans'
  | 'Found a better option'
  | 'Emergency'
  | 'Weather conditions'
  | 'Health issues'
  | 'Restaurant issue'
  | 'Other'

export interface Booking {
  id: string
  restaurantId: string
  userName: string
  userEmail: string
  userPhone: string
  date: string
  time: string
  partySize: number
  status: 'confirmed' | 'cancelled' | 'completed'
  discount: number
  couponCode?: string
  couponDiscount?: number
  basePrice: number
  finalPrice: number
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'cash'
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  createdAt: string
  cancelledAt?: string
  cancellationReason?: CancellationReason
  refundAmount?: number
  refundStatus?: 'pending' | 'processed' | 'completed'
}

export interface OTPSession {
  phone: string
  otp: string
  expiresAt: string
  verified: boolean
}

export interface Review {
  id: string
  restaurantId: string
  userEmail: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface User {
  email: string
  phone?: string
  totalBookings: number
  loyaltyTier: 'none' | 'bronze' | 'silver' | 'gold'
  discountPercent: number
}

export interface Coupon {
  code: string
  email: string
  discountPercent: number
  validUntil: string
  used: boolean
  createdAt: string
}

export type CuisineType = 
  | 'Italian'
  | 'Japanese'
  | 'Indian'
  | 'Mexican'
  | 'American'
  | 'French'
  | 'Chinese'
  | 'Thai'
  | 'Mediterranean'
  | 'Steakhouse'

export type SortOption = 'rating' | 'price-low' | 'price-high' | 'name'

export interface FilterState {
  cuisine: CuisineType[]
  priceRange: number[]
  minRating: number
  search: string
}

export type ComplaintType = 
  | 'Poor Service'
  | 'Food Quality Issue'
  | 'Hygiene Concern'
  | 'Billing Issue'
  | 'Wait Time'
  | 'Facility Problem'
  | 'Other'

export interface Complaint {
  id: string
  bookingCode: string
  userEmail: string
  complaintType: ComplaintType
  comments: string
  createdAt: string
  status: 'submitted' | 'under-review' | 'resolved'
}

export interface Feedback {
  id: string
  userEmail: string
  bookingCode?: string
  rating: number
  serviceRating: number
  foodRating: number
  ambianceRating: number
  category: 'Service' | 'Food Quality' | 'Ambiance & Cleanliness' | 'Value for Money' | 'Overall Experience'
  comments: string
  createdAt: string
}
