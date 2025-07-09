// Import Next.js components for optimized images and navigation
import Image from "next/image"
import Link from "next/link"
// Import UI components from our design system
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// Import icons from Lucide React (icon library)
import { Check } from "lucide-react"
// Import custom component for displaying upcoming events
import UpcomingEvents from "@/components/upcoming-events"

// Main home page component - this is what users see when they visit the site
export default function Home() {
  // Define the benefits that attendees receive when they register
  // This data could come from a database in a real application
  const benefits = [
    "Attend with a Spouse, Partner, or Guest",
    "Workbook and Essential Reports (Valued at $1439)",
    "Optional 1-Hour, One-on-One Consultation",
  ]

  // Define the reports included with registration
  // Each report has a title, description, and value
  const reports = [
    {
      title: "Social Security Maximization",
      description: "This report will provide you with your customized Social Security collection options.",
      value: "$49",
    },
    {
      title: "Fee and Drawdown Analysis",
      description:
        "This report will show you the historical drawdown risk in your portfolio as well as confirm the current level of internal fees you are paying in your investments.",
      value: "$245",
    },
    {
      title: "IRA/401k Tax Analysis",
      description:
        "This report will show you potential tax savings strategies to consider for your IRA and 401(k) holdings.",
      value: "$279",
    },
    {
      title: "Income Sourcing Map",
      description: "This report will illustrate retirement income sources and options for you.",
      value: "$437",
    },
    {
      title: "Asset Allocation Map",
      description: "This report will illustrate your asset allocation options for maximizing your results.",
      value: "$429",
    },
  ]

  return (
    <>
      {/* Hero Section - The main banner at the top of the page */}
      <section className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        {/* Background image with overlay */}
        <div className="absolute inset-0 opacity-15">
          <Image src="/NRR-BooksDown.png" alt="New Retirement Rules Books" fill className="object-cover" priority />
        </div>
        {/* Content container with responsive padding */}
        <div className="container relative py-8">
          <div className="py-8">
            <div className="space-y-6">
              {/* Badge to highlight new class availability */}
              <Badge className="bg-white text-amber-700 hover:bg-gray-100">New Class Available</Badge>
              {/* Main headline with responsive text sizing */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">New Retirement Rules™</h1>
              {/* Subtitle */}
              <p className="text-xl md:text-2xl font-medium">The New Economy Requires New Planning Strategies</p>
              {/* Description text */}
              <p className="text-lg">
                An essential course for adults 55-70 who want to secure their financial future in today's changing
                economy.
              </p>
              {/* Call-to-action button that links to registration page */}
              <Button asChild size="lg" className="text-lg bg-orange-500 hover:bg-orange-600">
                <Link href="/register">Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section - Displays available class dates */}
      <section className="py-16 bg-gray-50" id="events">
        <div className="container">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Classes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us at one of our upcoming New Retirement Rules™ classes to learn essential strategies for today's
              economy.
            </p>
          </div>
          {/* Custom component that fetches and displays events from database */}
          <UpcomingEvents />
        </div>
      </section>

      {/* Course Benefits Section - Explains what attendees receive */}
      <section className="py-16" id="about">
        <div className="container">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Receive</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our New Retirement Rules™ class provides valuable resources to help you navigate today's economic
              challenges.
            </p>
          </div>

          {/* Grid of benefit cards - responsive layout */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Map through benefits array to create cards */}
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  {/* Icon container with check mark */}
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  {/* Benefit text */}
                  <h3 className="text-xl font-bold mb-2">{benefit}</h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reports section with detailed breakdown */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h3 className="text-2xl font-bold mb-6 text-center">Your Essential Reports Include:</h3>
            <div className="space-y-6">
              {/* Map through reports array to create list items */}
              {reports.map((report, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-start gap-4 pb-6 border-b last:border-0 last:pb-0"
                >
                  {/* Report details */}
                  <div className="md:w-3/4">
                    <h4 className="text-xl font-bold mb-2">
                      {index + 1}. {report.title}
                    </h4>
                    <p className="text-muted-foreground">{report.description}</p>
                  </div>
                  {/* Report value badge */}
                  <div className="md:w-1/4 text-right">
                    <Badge variant="outline" className="text-lg px-3 py-1 border-primary text-primary">
                      Valued at {report.value}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section - Builds trust with money-back guarantee */}
      <section className="py-16 bg-primary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">100% Money-Back Guarantee</h2>
            <p className="text-lg mb-8">
              If, after attending all class sessions, you are in any way dissatisfied, please let us know and you will
              receive a full refund of the tuition fee and you can keep the Essential Reports valued at $1,439 as our
              gift.
            </p>
            {/* Final call-to-action button */}
            <Button asChild size="lg" className="text-lg">
              <Link href="/register">Register Now - Only $49</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
