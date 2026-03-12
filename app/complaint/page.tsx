import { Metadata } from 'next'
import { ComplaintForm } from '@/components/complaint-form'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'File a Complaint - TableBook Aligarh',
  description: 'Submit a complaint about your dining experience or booking. Help us improve our service.',
}

export default function ComplaintPage() {
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
              <BreadcrumbLink href="/bookings">My Bookings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-foreground font-medium">File Complaint</span>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-3">
            File a Complaint
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We value your feedback and are committed to providing the best dining experience. 
            If you encountered any issues, please let us know so we can make things right.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl">
          <ComplaintForm />
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
                  How do I find my booking code?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Your booking code was sent to your registered email address immediately after booking confirmation. 
                  You can also find it on your booking confirmation page or receipt.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  How long does it take to resolve complaints?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our team reviews all complaints within 24-48 hours and works towards a resolution. 
                  For urgent matters, please call our helpline for immediate assistance.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Can I track my complaint status?
                </h3>
                <p className="text-muted-foreground text-sm">
                  You'll receive email updates about your complaint status. For urgent queries, 
                  you can contact our customer support team directly.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  What information should I include in my complaint?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Please provide as much detail as possible, including what happened, when it happened, 
                  and how it affected your experience. This helps us investigate and resolve your issue faster.
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Is my information kept confidential?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes, all complaint information is handled confidentially and securely. 
                  We only share relevant details with the restaurant and staff involved in resolving your issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
