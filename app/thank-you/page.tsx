// Import Next.js metadata type for SEO
import type { Metadata } from "next"
// Import Next.js Link component for navigation
import Link from "next/link"
// Import UI components from our design system
import { Button } from "@/components/ui/button"
// Import icons from Lucide React
import { CheckCircle } from "lucide-react"

// Define metadata for SEO and browser tab information
export const metadata: Metadata = {
  title: "Thank You | New Retirement Rules™",
  description: "Thank you for registering for the New Retirement Rules™ class.",
}

// Thank you page component - displayed after successful payment
export default function ThankYouPage() {
  return (
    <div className="container max-w-4xl py-12">
      {/* Success message with checkmark icon */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Your Registration!</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your payment has been processed successfully. You are now registered for the New Retirement Rules™ class.
        </p>
      </div>

      {/* Information section with next steps */}
      <div className="bg-gray-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
        <div className="space-y-4">
          <p>You will receive a confirmation email shortly with all the details about your upcoming class.</p>
          <p>Please arrive 15 minutes before the class starts to check in and receive your materials.</p>
          <p>
            If you have any questions or need to make changes to your registration, please contact us at 866-921-3613.
          </p>
        </div>
      </div>

      {/* Navigation button to return to home page */}
      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}
