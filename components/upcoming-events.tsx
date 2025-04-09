"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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

export default function UpcomingEvents() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden flex flex-col h-full">
          <CardContent className="p-6 flex-grow">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold">{formatDate(event.date)}</p>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" /> {event.time || "9:00 AM - 12:00 PM"}
                </p>
              </div>
            </div>
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
