// This component needs to run on the client side because it uses React hooks and makes API calls
"use client"

// Import React hooks for managing component state and side effects
import { useEffect, useState } from "react"
// Import Next.js Link component for navigation
import Link from "next/link"
// Import UI components from our design system
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
// Import icons from Lucide React
import { Calendar, MapPin, Clock } from "lucide-react"
// Import Supabase client for database operations
import { createClient } from "@/lib/supabase/client"

// TypeScript interface defining the structure of an event object
interface Event {
  id: string
  date: string
  location_name: string
  address: string
  city: string
  state: string
  zip: string
  time: string
}

// Component for displaying upcoming events in a grid layout
export default function UpcomingEvents() {
  // State to store the list of events fetched from database
  const [events, setEvents] = useState<Event[]>([])
  // State to track if data is currently loading
  const [loading, setLoading] = useState(true)
  // State to store any error messages
  const [error, setError] = useState<string | null>(null)

  // useEffect hook runs when component mounts (empty dependency array)
  // This is where we fetch events from the database
  useEffect(() => {
    // Define async function to fetch events
    async function fetchEvents() {
      try {
        // Create Supabase client for database connection
        const supabase = createClient()
        
        // Query the events table for upcoming events
        const { data, error } = await supabase
          .from("events")
          .select("*") // Select all columns
          .gte("date", new Date().toISOString().split("T")[0]) // Only events from today onwards
          .order("date", { ascending: true }) // Sort by date, earliest first
          .limit(5) // Limit to 5 events for performance

        // If there's an error or no data, use fallback events
        if (error || !data || data.length === 0) {
          console.log("Using fallback events due to:", error?.message || "No events found")
          setEvents(fallbackEvents)
        } else {
          // Use the data from database
          setEvents(data)
        }
      } catch (err) {
        console.error("Error fetching events:", err)
        // Always use fallback events on any error
        setEvents(fallbackEvents)
      } finally {
        // Always set loading to false when done
        setLoading(false)
      }
    }

    // Call the fetch function
    fetchEvents()
  }, []) // Empty dependency array means this runs once when component mounts

  // Helper function to format dates for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create 3 skeleton cards to show while loading */}
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  // Render the events grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Map through events array to create event cards */}
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden flex flex-col h-full">
          <CardContent className="p-6 flex-grow">
            {/* Date and time information */}
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">{formatDate(event.date)}</p>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" /> {event.time || "9:00 AM - 12:00 PM"}
                </p>
              </div>
            </div>
            {/* Location information */}
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">{event.location_name}</p>
                <p className="text-sm text-muted-foreground">
                  {event.address}, {event.city}, {event.state} {event.zip}
                </p>
              </div>
            </div>
          </CardContent>
          {/* Registration button */}
          <CardFooter className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link href={`/register?eventId=${event.id}`}>Register Now</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

// Fallback events in case the database fetch fails
// This ensures the component always has data to display
const fallbackEvents: Event[] = [
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
