import type { Metadata } from "next"
import RegistrationForm from "@/components/registration-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Register for New Retirement Rules™ Class",
  description: "Register for our New Retirement Rules™ class designed for adults 55-70.",
}

interface PageProps {
  searchParams: {
    eventId?: string
  }
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const eventId = searchParams.eventId
  let event = null

  if (eventId) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single()

      if (error || !data) {
        // If no event is found with the provided ID, use fallback data
        event = getFallbackEvent(eventId)
      } else {
        event = data
      }
    } catch (err) {
      console.error("Error fetching event:", err)
      event = getFallbackEvent(eventId)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Register for New Retirement Rules™ Class</h1>
        <p className="text-lg text-muted-foreground">Complete the form below to register for our upcoming class.</p>
      </div>

      <RegistrationForm selectedEvent={event} />
    </div>
  )
}

// Fallback event data in case the database fetch fails
function getFallbackEvent(eventId: string) {
  const fallbackEvents = [
    {
      id: "1",
      date: "2025-04-12",
      location_name: "Calvin University Prince Conference Center",
      address: "1800 E Beltline Ave SE",
      city: "Grand Rapids",
      state: "MI",
      zip: "49546",
      time: "9:00 AM - 12:00 PM",
    },
    {
      id: "2",
      date: "2025-05-03",
      location_name: "Calvin University Prince Conference Center",
      address: "1800 E Beltline Ave SE",
      city: "Grand Rapids",
      state: "MI",
      zip: "49546",
      time: "9:00 AM - 12:00 PM",
    },
    {
      id: "3",
      date: "2025-05-10",
      location_name: "Lynn University International Business Center",
      address: "3601 N. Military Trail",
      city: "Boca Raton",
      state: "FL",
      zip: "33431",
      time: "9:00 AM - 12:00 PM",
    },
  ]

  return fallbackEvents.find((event) => event.id === eventId) || fallbackEvents[0]
}
