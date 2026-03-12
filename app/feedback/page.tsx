import { Metadata } from 'next'
import { FeedbackForm } from '@/components/feedback-form'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Share Feedback - TableBook Aligarh',
  description: 'Share your dining experience feedback to help us improve our services.',
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-foreground font-medium">Share Feedback</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
            Share Your Feedback
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Your feedback helps us understand your dining experience better and allows us to continuously improve our services. 
            We truly value your opinion!
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl">
          <FeedbackForm />
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Quick to Complete</h3>
            <p className="text-sm text-muted-foreground">
              Share your feedback in just a few minutes with our simple and intuitive form.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Your Voice Matters</h3>
            <p className="text-sm text-muted-foreground">
              Every piece of feedback directly influences how we improve our restaurant partners' services.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Completely Anonymous</h3>
            <p className="text-sm text-muted-foreground">
              You can choose to remain anonymous while still providing valuable insights about your experience.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-2xl">
          <div className="bg-card border rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  What types of feedback are most helpful?
                </h3>
                <p className="text-muted-foreground text-sm">
                  All feedback is valuable! Whether it's about your experience at a restaurant, our booking platform, 
                  or suggestions for improvements, we want to hear from you. Specific details help us address issues more effectively.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Do I need a booking code to submit feedback?
                </h3>
                <p className="text-muted-foreground text-sm">
                  No, a booking code is optional. You can submit feedback based on your general experience with us or any specific restaurant. 
                  Including a booking code helps us link your feedback to that specific dining experience.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  How will my feedback be used?
                </h3>
                <p className="text-muted-foreground text-sm">
                  We analyze all feedback to identify patterns and areas for improvement. Your input helps us work with restaurant 
                  partners to enhance their services and helps us improve the TableBook platform itself.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Will I receive a response to my feedback?
                </h3>
                <p className="text-muted-foreground text-sm">
                  While we review all feedback carefully, we may not be able to respond to every submission. However, if you provide 
                  your email, we may reach out to you regarding critical feedback or for more details.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  What if I have a complaint rather than general feedback?
                </h3>
                <p className="text-muted-foreground text-sm">
                  If you experienced a significant issue, you can file a formal complaint through our dedicated 
                  complaint page where we track resolution status and follow up more closely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
