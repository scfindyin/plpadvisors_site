import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <Card className="max-w-lg mx-auto text-center">
        <CardContent className="pt-8 pb-8">
          <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>

          <p className="text-lg text-muted-foreground mb-6">
            Thank you for registering for the New Retirement Rules™ class.
            You will receive a confirmation email shortly with all the details.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold mb-2">What's Next?</h2>
            <ul className="text-sm text-muted-foreground text-left space-y-2">
              <li>• Check your email for confirmation and class details</li>
              <li>• Mark your calendar for the class date</li>
              <li>• Bring a spouse, partner, or guest at no extra charge</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Questions? Call us at <strong>866-921-3613</strong>
          </p>

          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
