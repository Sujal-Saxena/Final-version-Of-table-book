'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { RatingStars } from '@/components/rating-stars'
import { Review } from '@/lib/types'
import {
  getReviewsByRestaurant,
  addReview,
  hasUserReviewedRestaurant,
  hasUserBookedRestaurant,
  getUser,
} from '@/lib/data/storage'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, User, Star, Utensils, Users, Sparkles, PenLine, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewsProps {
  restaurantId: string
}

interface ExtendedReview extends Review {
  foodRating?: number
  serviceRating?: number
  ambianceRating?: number
  title?: string
  helpful?: number
  notHelpful?: number
}

export function Reviews({ restaurantId }: ReviewsProps) {
  const [reviews, setReviews] = useState<ExtendedReview[]>([])
  const [canReview, setCanReview] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  // Review form state
  const [overallRating, setOverallRating] = useState(0)
  const [foodRating, setFoodRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [ambianceRating, setAmbianceRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    const loadReviews = () => {
      const restaurantReviews = getReviewsByRestaurant(restaurantId) as ExtendedReview[]
      setReviews(restaurantReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))

      const user = getUser()
      if (user) {
        const hasBooked = hasUserBookedRestaurant(user.email, restaurantId)
        const reviewed = hasUserReviewedRestaurant(user.email, restaurantId)
        setCanReview(hasBooked && !reviewed)
        setHasReviewed(reviewed)
      }
    }

    loadReviews()
  }, [restaurantId])

  const resetForm = () => {
    setOverallRating(0)
    setFoodRating(0)
    setServiceRating(0)
    setAmbianceRating(0)
    setReviewTitle('')
    setComment('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = getUser()
    if (!user) return

    setIsSubmitting(true)

    const newReview: ExtendedReview = {
      id: `rev-${Date.now()}`,
      restaurantId,
      userEmail: user.email,
      userName: user.email.split('@')[0],
      rating: overallRating,
      foodRating,
      serviceRating,
      ambianceRating,
      title: reviewTitle,
      comment,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString(),
    }

    addReview(newReview)
    setReviews([newReview, ...reviews])
    setSubmitSuccess(true)
    
    setTimeout(() => {
      setShowForm(false)
      resetForm()
      setCanReview(false)
      setHasReviewed(true)
      setIsSubmitting(false)
      setSubmitSuccess(false)
    }, 2000)
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

  const avgFoodRating = reviews.filter(r => r.foodRating).length > 0
    ? reviews.reduce((acc, r) => acc + (r.foodRating || 0), 0) / reviews.filter(r => r.foodRating).length
    : 0

  const avgServiceRating = reviews.filter(r => r.serviceRating).length > 0
    ? reviews.reduce((acc, r) => acc + (r.serviceRating || 0), 0) / reviews.filter(r => r.serviceRating).length
    : 0

  const avgAmbianceRating = reviews.filter(r => r.ambianceRating).length > 0
    ? reviews.reduce((acc, r) => acc + (r.ambianceRating || 0), 0) / reviews.filter(r => r.ambianceRating).length
    : 0

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.round(r.rating) === stars).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => Math.round(r.rating) === stars).length / reviews.length) * 100 
      : 0
  }))

  const isFormValid = overallRating > 0 && foodRating > 0 && serviceRating > 0 && ambianceRating > 0 && comment.trim().length > 10

  return (
    <div className="space-y-8">
      {/* Reviews Header with Stats */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Reviews & Ratings
          </h2>
        </div>

        {/* Rating Overview */}
        {reviews.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
                    <RatingStars rating={averageRating} size="md" className="mt-2 justify-center" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="flex-1 space-y-2">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm w-3">{stars}</span>
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <Progress value={percentage} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Ratings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Rating by Category</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Utensils className="h-5 w-5 mx-auto text-primary mb-1" />
                      <div className="text-lg font-semibold">{avgFoodRating > 0 ? avgFoodRating.toFixed(1) : '-'}</div>
                      <p className="text-xs text-muted-foreground">Food</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                      <div className="text-lg font-semibold">{avgServiceRating > 0 ? avgServiceRating.toFixed(1) : '-'}</div>
                      <p className="text-xs text-muted-foreground">Service</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Sparkles className="h-5 w-5 mx-auto text-primary mb-1" />
                      <div className="text-lg font-semibold">{avgAmbianceRating > 0 ? avgAmbianceRating.toFixed(1) : '-'}</div>
                      <p className="text-xs text-muted-foreground">Ambiance</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Rate & Review Section - Always Visible */}
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Rate & Review This Restaurant
          </CardTitle>
          <CardDescription>
            {canReview 
              ? "Share your dining experience to help others make informed decisions"
              : hasReviewed 
                ? "You have already reviewed this restaurant"
                : "Book and dine at this restaurant to leave a review"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">Your review has been submitted successfully.</p>
            </div>
          ) : hasReviewed ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Review Submitted</h3>
              <p className="text-sm text-muted-foreground">
                Thank you for sharing your experience! Your review helps others make better dining decisions.
              </p>
            </div>
          ) : !canReview ? (
            <div className="py-6">
              {/* Preview Rating Section - Disabled */}
              <div className="opacity-60 pointer-events-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="sm:col-span-2 p-4 rounded-lg bg-muted/30 border">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        Overall Rating
                      </label>
                    </div>
                    <RatingStars rating={0} size="lg" />
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <label className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Utensils className="h-4 w-4 text-primary" />
                      Food Quality
                    </label>
                    <RatingStars rating={0} size="md" />
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <label className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-primary" />
                      Service
                    </label>
                    <RatingStars rating={0} size="md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Comment</label>
                  <Textarea
                    placeholder="Tell us about your dining experience..."
                    disabled
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              
              {/* Call to Action */}
              <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                    <PenLine className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                      Want to leave a review?
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Book a table at this restaurant and complete your dining experience to unlock the ability to rate and review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Overall Rating */}
                <div className="sm:col-span-2 p-4 rounded-lg bg-muted/30 border">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      Overall Rating
                      <span className="text-destructive">*</span>
                    </label>
                    {overallRating > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {overallRating === 5 ? 'Excellent' : overallRating === 4 ? 'Very Good' : overallRating === 3 ? 'Good' : overallRating === 2 ? 'Fair' : 'Poor'}
                      </span>
                    )}
                  </div>
                  <RatingStars
                    rating={overallRating}
                    interactive
                    onRatingChange={setOverallRating}
                    size="lg"
                  />
                </div>

                {/* Food Rating */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <label className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Utensils className="h-4 w-4 text-primary" />
                    Food Quality
                    <span className="text-destructive">*</span>
                  </label>
                  <RatingStars
                    rating={foodRating}
                    interactive
                    onRatingChange={setFoodRating}
                    size="md"
                  />
                </div>

                {/* Service Rating */}
                <div className="p-4 rounded-lg bg-muted/30 border">
                  <label className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-primary" />
                    Service
                    <span className="text-destructive">*</span>
                  </label>
                  <RatingStars
                    rating={serviceRating}
                    interactive
                    onRatingChange={setServiceRating}
                    size="md"
                  />
                </div>

                {/* Ambiance Rating */}
                <div className="sm:col-span-2 p-4 rounded-lg bg-muted/30 border">
                  <label className="text-sm font-medium flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Ambiance & Atmosphere
                    <span className="text-destructive">*</span>
                  </label>
                  <RatingStars
                    rating={ambianceRating}
                    interactive
                    onRatingChange={setAmbianceRating}
                    size="md"
                  />
                </div>
              </div>

              <Separator />

              {/* Review Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Review Title
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </label>
                <Input
                  placeholder="Summarize your experience in a few words..."
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Your Comment
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <span className={cn(
                    "text-xs",
                    comment.length < 10 ? "text-muted-foreground" : "text-green-600"
                  )}>
                    {comment.length}/500 characters
                  </span>
                </div>
                <Textarea
                  placeholder="Tell us about your dining experience. What did you enjoy? What could be improved? Your feedback helps other diners and the restaurant..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  rows={5}
                  className="resize-none"
                />
                {comment.length > 0 && comment.length < 10 && (
                  <p className="text-xs text-destructive">Please write at least 10 characters</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !isFormValid}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Your Review'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {reviews.length > 0 ? 'Customer Reviews' : ''}
        </h3>
        
        {reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="font-medium">{review.userName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <RatingStars rating={review.rating} size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {review.title && (
                    <h4 className="font-medium mb-1">{review.title}</h4>
                  )}
                  
                  <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                  
                  {/* Category Ratings */}
                  {(review.foodRating || review.serviceRating || review.ambianceRating) && (
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-3 border-t">
                      {review.foodRating && (
                        <div className="flex items-center gap-1">
                          <Utensils className="h-3 w-3" />
                          <span>Food: {review.foodRating}/5</span>
                        </div>
                      )}
                      {review.serviceRating && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>Service: {review.serviceRating}/5</span>
                        </div>
                      )}
                      {review.ambianceRating && (
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          <span>Ambiance: {review.ambianceRating}/5</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Helpful Buttons */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Was this review helpful?</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        Yes {review.helpful ? `(${review.helpful})` : ''}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                        <ThumbsDown className="h-3 w-3" />
                        No {review.notHelpful ? `(${review.notHelpful})` : ''}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-medium mb-1">No Reviews Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Be the first to share your dining experience at this restaurant!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
