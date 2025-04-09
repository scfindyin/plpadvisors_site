"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Clock } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface Event {
  id: string
  date: string
  location_name: string
  address: string
  city: string
  state: string
  zip: string
  time?: string
}

interface EventSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function EventSelector({ value, onChange }: EventSelectorProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("date", new Date().toISOString().split("T")[0])
          .order("date", { ascending: true })
          .limit(5)

        // If there's an error or no data, use fallback events
        if (error || !data || data.length === 0) {
          console.log("Using fallback events due to:", error?.message || "No events found")
          setEvents(fallbackEvents)
        } else {
          setEvents(data)
        }
      } catch (err) {
        console.error("Error fetching events:", err)
        // Always use fallback events on any error
        setEvents(fallbackEvents)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  if (loading) {
    return (
      <div className="space-y-4">
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

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-start space-x-2">
          <RadioGroupItem value={event.id} id={event.id} className="mt-1" />
          <Label htmlFor={event.id} className="flex-1 cursor-pointer">
            <div className="border rounded-md p-4 hover:border-primary transition-colors">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
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
