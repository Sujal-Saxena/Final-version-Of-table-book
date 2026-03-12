'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { addFeedback, generateFeedbackId, getBookingById } from '@/lib/data/storage'
import { AlertCircle, Loader2, CheckCircle, Star } from 'lucide-react'

const FEEDBACK_CATEGORIES = [
  'Service',
  'Food Quality',
  'Ambiance & Cleanliness',
  'Value for Money',
  'Overall Experience',
] as const

export function FeedbackForm() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [bookingCode, setBookingCode] = useState('')
  const [category, setCategory] = useState<'Service' | 'Food Quality' | 'Ambiance & Cleanliness' | 'Value for Money' | 'Overall Experience'>('Overall Experience')
  const [rating, setRating] = useState(5)
  const [serviceRating, setServiceRating] = useState(5)
  const [foodRating, setFoodRating] = useState(5)
  const [ambianceRating, setAmbianceRating] = useState(5)
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    if (!userEmail.trim()) {
      setError('Please enter your email address')
      return false
    }

    if (comments.trim().length < 10) {
      setError('Please provide feedback with at least 10 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const feedback = {
        id: generateFeedbackId(),
        userEmail: userEmail.trim().toLowerCase(),
        bookingCode: bookingCode.trim() || undefined,
        rating,
        serviceRating,
        foodRating,
        ambianceRating,
        category,
        comments: comments.trim(),
        createdAt: new Date().toISOString(),
      }

      addFeedback(feedback)
      setSuccess(true)

      // Reset form
      setTimeout(() => {
        setUserEmail('')
        setBookingCode('')
        setComments('')
        setRating(5)
        setServiceRating(5)
        setFoodRating(5)
        setAmbianceRating(5)
        setCategory('Overall Experience')
      }, 2000)
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (value: number, setter: (v: number) => void) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setter(star)}
            className="transition-colors"
            type="button"
          >
            <Star
              size={28}
              className={`${
                star <= value
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-muted-foreground ml-2 pt-1">{value}/5</span>
      </div>
    )
  }

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Feedback Submitted!</h3>
          </div>
          <p className="text-center text-green-800 mb-6">
            Thank you for your valuable feedback! We appreciate your time and will use your insights to improve our services.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            className="w-full"
          >
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>
          Help us improve your dining experience by sharing your thoughts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Email Section */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Booking Code (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="booking">Booking Code (Optional)</Label>
            <Input
              id="booking"
              placeholder="e.g., BK123ABC456"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Help us link your feedback to a specific booking
            </p>
          </div>

          {/* Feedback Category */}
          <div className="space-y-2">
            <Label htmlFor="category">What are you providing feedback about? *</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)}>
              <SelectTrigger id="category" disabled={isSubmitting}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Overall Rating */}
          <div className="space-y-3">
            <Label>Overall Rating *</Label>
            {renderStars(rating, setRating)}
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <p className="font-medium text-sm">Detailed Ratings (Optional)</p>

            <div className="space-y-2">
              <Label className="text-sm">Service Quality</Label>
              {renderStars(serviceRating, setServiceRating)}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Food Quality</Label>
              {renderStars(foodRating, setFoodRating)}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Ambiance & Cleanliness</Label>
              {renderStars(ambianceRating, setAmbianceRating)}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Your Feedback *</Label>
            <Textarea
              id="comments"
              placeholder="Tell us what you liked or what we can improve..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {comments.length} characters (minimum 10 required)
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
