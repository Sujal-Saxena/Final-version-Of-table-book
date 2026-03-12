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
import { ComplaintType } from '@/lib/types'
import { addComplaint, generateComplaintId, getBookingById } from '@/lib/data/storage'
import { AlertCircle, Loader2, CheckCircle, Phone, Mail, FileText } from 'lucide-react'

const COMPLAINT_TYPES: ComplaintType[] = [
  'Poor Service',
  'Food Quality Issue',
  'Hygiene Concern',
  'Billing Issue',
  'Wait Time',
  'Facility Problem',
  'Other',
]

const HELPLINE_NUMBER = '+91 97777 77777'

export function ComplaintForm() {
  const router = useRouter()
  const [bookingCode, setBookingCode] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [complaintType, setComplaintType] = useState<ComplaintType>('Poor Service')
  const [comments, setComments] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [bookingNotFound, setBookingNotFound] = useState(false)

  const validateBookingCode = () => {
    if (!bookingCode.trim()) {
      setError('Please enter a booking code')
      setBookingNotFound(false)
      return false
    }

    const booking = getBookingById(bookingCode.trim())
    if (!booking) {
      setError('Booking code not found. Please check and try again.')
      setBookingNotFound(true)
      return false
    }

    if (booking.userEmail.toLowerCase() !== userEmail.toLowerCase()) {
      setError('Email does not match the booking record.')
      setBookingNotFound(false)
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBookingNotFound(false)

    if (!bookingCode.trim() || !userEmail.trim() || !comments.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (!validateBookingCode()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const complaint = {
        id: generateComplaintId(),
        bookingCode: bookingCode.trim(),
        userEmail: userEmail.trim().toLowerCase(),
        complaintType,
        comments: comments.trim(),
        createdAt: new Date().toISOString(),
        status: 'submitted' as const,
      }

      addComplaint(complaint)
      setSuccess(true)
      
      // Reset form
      setTimeout(() => {
        setBookingCode('')
        setUserEmail('')
        setComplaintType('Poor Service')
        setComments('')
        setSuccess(false)
        router.push('/bookings')
      }, 2000)
    } catch (err) {
      setError('Failed to submit complaint. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Helpline Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Phone className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground">Need Immediate Assistance?</h3>
              <p className="text-sm text-muted-foreground">
                Call our helpline: <span className="font-bold text-primary">{HELPLINE_NUMBER}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">Available 24/7 for urgent issues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaint Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            File a Complaint
          </CardTitle>
          <CardDescription>
            Help us improve by sharing your feedback about your dining experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Code Section */}
            <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
              <Label htmlFor="bookingCode" className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" />
                Booking Code
              </Label>
              <p className="text-sm text-muted-foreground">
                Enter the booking code from your confirmation email or receipt
              </p>
              <Input
                id="bookingCode"
                type="text"
                placeholder="e.g., BKA1B2C3D4"
                value={bookingCode}
                onChange={(e) => {
                  setBookingCode(e.target.value.toUpperCase())
                  setError('')
                  setBookingNotFound(false)
                }}
                className="font-mono"
              />
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <p className="text-sm text-muted-foreground">
                Enter the email address associated with your booking
              </p>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={userEmail}
                onChange={(e) => {
                  setUserEmail(e.target.value)
                  setError('')
                  setBookingNotFound(false)
                }}
              />
            </div>

            {/* Complaint Type Section */}
            <div className="space-y-2">
              <Label htmlFor="complaintType" className="font-semibold">
                Complaint Type
              </Label>
              <p className="text-sm text-muted-foreground">
                Select the category that best describes your issue
              </p>
              <Select value={complaintType} onValueChange={(value) => setComplaintType(value as ComplaintType)}>
                <SelectTrigger id="complaintType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPLAINT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Comments Section */}
            <div className="space-y-2">
              <Label htmlFor="comments" className="font-semibold">
                Detailed Comments
              </Label>
              <p className="text-sm text-muted-foreground">
                Please provide detailed information about your complaint to help us resolve it faster
              </p>
              <Textarea
                id="comments"
                placeholder="Describe what happened in detail... (minimum 20 characters)"
                value={comments}
                onChange={(e) => {
                  setComments(e.target.value)
                  setError('')
                }}
                className="min-h-[150px] resize-none"
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>{comments.length} / 1000 characters</span>
                {comments.length < 20 && comments.length > 0 && (
                  <span className="text-amber-600">Minimum 20 characters required</span>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Thank you! Your complaint has been submitted successfully. Our team will review it shortly.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting || success || comments.length < 20}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submitted
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t space-y-3">
            <h4 className="font-semibold text-sm">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Your complaint is submitted to our management team</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>We review it within 24-48 hours</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>You'll receive a response on your registered email</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>We work towards resolution or compensation as applicable</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
