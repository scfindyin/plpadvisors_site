// Import Next.js metadata type for SEO
import type { Metadata } from "next"
// Import custom registration form component
import RegistrationForm from "@/components/registration-form"
// Import Supabase client for server-side database operations
import { createClient } from "@/lib/supabase/server"

// Define metadata for SEO and browser tab information
export const metadata: Metadata = {
  title: "Register for New Retirement Rules™ Class",
  description: "Register for our New Retirement Rules™ class designed for adults 55-70.",
}

// TypeScript interface defining the props this page component accepts
interface PageProps {
  searchParams: {
    eventId?: string // Optional event ID from URL query parameters
  }
}

// Registration page component - handles both direct visits and event-specific registrations
export default async function RegisterPage({ searchParams }: PageProps) {
  // Extract event ID from URL query parameters
  const eventId = searchParams.eventId
  let event = null

  // If an event ID was provided in the URL, fetch that specific event
  if (eventId) {
    try {
      // Create Supabase client for server-side database operations
      const supabase = await createClient()
      
      // Query the events table for the specific event
      const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single()

      // If no event is found with the provided ID, use fallback data
      if (error || !data) {
        event = getFallbackEvent(eventId)
      } else {
        // Use the event data from database
        event = data
      }
    } catch (err) {
      console.error("Error fetching event:", err)
      // Use fallback event data if there's an error
      event = getFallbackEvent(eventId)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      {/* Page header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Register for New Retirement Rules™ Class</h1>
        <p className="text-lg text-muted-foreground">Complete the form below to register for our upcoming class.</p>
      </div>

      {/* Registration form component with optional pre-selected event */}
      <RegistrationForm selectedEvent={event} />
    </div>
  )
}

// Fallback event data in case the database fetch fails
// This ensures the page always has data to display
function getFallbackEvent(eventId: string) {
  // Array of fallback events with hardcoded data
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

  // Find the event with the matching ID, or return the first event as default
  return fallbackEvents.find((event) => event.id === eventId) || fallbackEvents[0]
}
