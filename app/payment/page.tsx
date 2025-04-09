import type { Metadata } from "next"
import PaymentForm from "@/components/payment-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Complete Your Payment | New Retirement Rules™",
  description: "Complete your payment for the New Retirement Rules™ class.",
}

interface PageProps {
  searchParams: {
    registrationId?: string
  }
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const registrationId = searchParams.registrationId
  let registration = null

  if (registrationId) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("registrations")
      .select("*, event:events(*)")
      .eq("id", registrationId)
      .single()

    if (!error && data) {
      registration = data
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Payment</h1>
        <p className="text-lg text-muted-foreground">
          Please provide your payment information to complete your registration.
        </p>
      </div>

      <PaymentForm registrationData={registration} />
    </div>
  )
}
