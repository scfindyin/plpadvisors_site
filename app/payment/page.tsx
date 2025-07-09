// Import Next.js metadata type for SEO
import type { Metadata } from "next"
// Import custom payment form component
import PaymentForm from "@/components/payment-form"
// Import Supabase client for server-side database operations
import { createClient } from "@/lib/supabase/server"

// Define metadata for SEO and browser tab information
export const metadata: Metadata = {
  title: "Complete Your Payment | New Retirement Rules™",
  description: "Complete your payment for the New Retirement Rules™ class.",
}

// TypeScript interface defining the props this page component accepts
interface PageProps {
  searchParams: {
    registrationId?: string // Optional registration ID from URL query parameters
  }
}

// Payment page component - handles payment processing for registrations
export default async function PaymentPage({ searchParams }: PageProps) {
  // Extract registration ID from URL query parameters
  const registrationId = searchParams.registrationId
  let registration = null

  // If a registration ID was provided in the URL, fetch that specific registration
  if (registrationId) {
    // Create Supabase client for server-side database operations
    const supabase = await createClient()
    
    // Query the registrations table and join with events table to get complete data
    const { data, error } = await supabase
      .from("registrations")
      .select("*, event:events(*)") // Join with events table to get event details
      .eq("id", registrationId)
      .single()

    // If registration data is found, use it
    if (!error && data) {
      registration = data
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Payment</h1>
        <p className="text-lg text-muted-foreground">
          Please provide your payment information to complete your registration.
        </p>
      </div>

      {/* Payment form component with optional registration data */}
      <PaymentForm registrationData={registration} />
    </div>
  )
}
