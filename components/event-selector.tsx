// This component needs to run on the client side because it uses React hooks and makes API calls
"use client"

// Import React hooks for managing component state and side effects
import { useEffect, useState } from "react"
// Import icons from Lucide React
import { Calendar, MapPin, Clock } from "lucide-react"
// Import UI components from our design system
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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
  time?: string // Optional field
}

// TypeScript interface defining the props this component accepts
interface EventSelectorProps {
  value: string // Currently selected event ID
  onChange: (value: string) => void // Function to call when selection changes
}

// Component for selecting an event from a list of upcoming events
export default function EventSelector({ value, onChange }: EventSelectorProps) {
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
      <div className="space-y-4">
        {/* Create 3 skeleton cards to show while loading */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-md p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  // Show error message if there was an error
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  // Render the event selection interface
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
      {/* Map through events array to create radio button options */}
      {events.map((event) => (
        <div key={event.id} className="flex items-start space-x-2">
          {/* Radio button for selection */}
          <RadioGroupItem value={event.id} id={event.id} className="mt-1" />
          {/* Label that wraps the entire event card for better UX */}
          <Label htmlFor={event.id} className="flex-1 cursor-pointer">
            <div className="border rounded-md p-4 hover:border-primary transition-colors">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Date and time information */}
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    {event.time && (
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" /> {event.time}
                      </p>
                    )}
                  </div>
                </div>
                {/* Location information */}
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">{event.location_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.address}, {event.city}, {event.state} {event.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
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
