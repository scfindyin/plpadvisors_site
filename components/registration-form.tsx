// This component needs to run on the client side (browser) because it uses React hooks and browser APIs
"use client"

// Import React hooks for managing component state and side effects
import { useState } from "react"
// Import Next.js router for programmatic navigation
import { useRouter } from "next/navigation"
// Import form validation library
import { zodResolver } from "@hookform/resolvers/zod"
// Import React Hook Form for form state management
import { useForm } from "react-hook-form"
// Import Zod for schema validation
import { z } from "zod"
// Import icons from Lucide React
import { Calendar, MapPin } from "lucide-react"
// Import UI components from our design system
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Import server action for handling form submission
import { registerAttendee } from "@/lib/actions"
import { Checkbox } from "@/components/ui/checkbox"
// Import custom component for event selection
import EventSelector from "@/components/event-selector"

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
interface RegistrationFormProps {
  selectedEvent: Event | null // Can be null if no event is pre-selected
}

// Define the validation schema using Zod
// This ensures all form data is properly validated before submission
const formSchema = z.object({
  eventId: z.string().min(1, "Please select an event"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  guestName: z.string().optional(), // Optional field for guest/spouse
  confirmEvent: z.boolean().refine((val) => val === true, {
    message: "Please confirm your event selection",
  }),
})

// Main registration form component
export default function RegistrationForm({ selectedEvent }: RegistrationFormProps) {
  // Router hook for programmatic navigation
  const router = useRouter()
  // State to track if form is currently submitting
  const [isSubmitting, setIsSubmitting] = useState(false)
  // State to store any error messages
  const [error, setError] = useState<string | null>(null)

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

  // Initialize React Hook Form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use Zod for validation
    defaultValues: {
      eventId: selectedEvent?.id || "", // Pre-fill if event is selected
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      guestName: "",
      confirmEvent: false,
    },
  })

  // Function that runs when form is submitted
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true) // Show loading state
    setError(null) // Clear any previous errors

    try {
      // Call server action to register the attendee
      const result = await registerAttendee(values)

      if (result.success) {
        // Store registration data in browser session storage for payment page
        sessionStorage.setItem("registrationData", JSON.stringify(values))
        // Navigate to payment page with registration ID
        router.push(`/payment?registrationId=${result.registrationId}`)
      } else {
        // Display error message if registration failed
        setError(result.error || "Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false) // Hide loading state
    }
  }

  return (
    <div>
      {/* Display selected event information if one is pre-selected */}
      {selectedEvent && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Selected Event</h2>
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              {/* Date and time information */}
              <div className="flex items-start gap-4">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                  {selectedEvent.time && <p className="text-sm text-muted-foreground">{selectedEvent.time}</p>}
                </div>
              </div>
              {/* Location information */}
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">{selectedEvent.location_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEvent.address}, {selectedEvent.city}, {selectedEvent.state} {selectedEvent.zip}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form component from React Hook Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Event selector - only show if no event is pre-selected */}
          {!selectedEvent && (
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Event</FormLabel>
                  <FormControl>
                    <EventSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Name fields in a responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address *</FormLabel>
                <FormControl>
                  <Input placeholder="Street Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City, State, Zip in responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contact information in responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cell Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="Cell Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="Email Address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Optional guest name field */}
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guest Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="If a spouse or guest will be accompanying you, please enter their name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirmation checkbox */}
          <FormField
            control={form.control}
            name="confirmEvent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I confirm that this is the class I want to register for *</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error message display */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>}

          {/* Submit button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Complete Registration Step #1"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

// Array of US states for the dropdown
const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]
