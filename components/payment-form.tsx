// This component needs to run on the client side because it uses React hooks and browser APIs
"use client"

// Import React hooks for managing component state and side effects
import { useState, useEffect } from "react"
// Import Next.js router for programmatic navigation
import { useRouter } from "next/navigation"
// Import form validation library
import { zodResolver } from "@hookform/resolvers/zod"
// Import React Hook Form for form state management
import { useForm } from "react-hook-form"
// Import Zod for schema validation
import { z } from "zod"
// Import UI components from our design system
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Import server action for handling payment processing
import { processPayment } from "@/lib/actions"

// TypeScript interface defining the props this component accepts
interface PaymentFormProps {
  registrationData: any // Registration data from server or session storage
}

// Define the validation schema using Zod
// This ensures all payment data is properly validated before submission
const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  cardType: z.string().min(1, "Card type is required"),
  cardNumber: z.string().min(13, "Card number is required").max(19),
  expirationMonth: z.string().min(1, "Month is required"),
  expirationYear: z.string().min(4, "Year is required"),
  securityCode: z.string().min(3, "Security code is required").max(4),
})

// Component for processing payment information
export default function PaymentForm({ registrationData }: PaymentFormProps) {
  // Router hook for programmatic navigation
  const router = useRouter()
  // State to track if form is currently submitting
  const [isSubmitting, setIsSubmitting] = useState(false)
  // State to store any error messages
  const [error, setError] = useState<string | null>(null)
  // State to store registration data from session storage (fallback)
  const [clientRegistrationData, setClientRegistrationData] = useState<any>(null)

  // useEffect hook runs when component mounts
  // This handles cases where server-side registration data is not available
  useEffect(() => {
    // If server-side registration data is not available, try to get it from session storage
    if (!registrationData) {
      try {
        const storedData = sessionStorage.getItem("registrationData")
        if (storedData) {
          setClientRegistrationData(JSON.parse(storedData))
        }
      } catch (err) {
        console.error("Error retrieving registration data:", err)
      }
    }
  }, [registrationData])

  // Use either server-side data or client-side data
  const data = registrationData || clientRegistrationData

  // Initialize React Hook Form with validation schema and default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use Zod for validation
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      address: data?.address || "",
      city: data?.city || "",
      state: data?.state || "",
      zipCode: data?.zipCode || "",
      cardType: "",
      cardNumber: "",
      expirationMonth: "",
      expirationYear: "",
      securityCode: "",
    },
  })

  // Function that runs when form is submitted
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true) // Show loading state
    setError(null) // Clear any previous errors

    try {
      // Call server action to process the payment
      const result = await processPayment({
        ...values,
        registrationId: registrationData?.id || "unknown",
      })

      if (result.success) {
        // Clear session storage after successful payment
        sessionStorage.removeItem("registrationData")
        // Navigate to thank you page with payment ID
        router.push(`/thank-you?paymentId=${result.paymentId}`)
      } else {
        // Display error message if payment failed
        setError(result.error || "Payment failed. Please try again.")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false) // Hide loading state
    }
  }

  return (
    <div>
      {/* Order summary card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Class details */}
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-bold">New Retirement Rules Class</h3>
                <p className="text-sm text-muted-foreground">{data?.event?.location_name || "Upcoming Class"}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$49.00</p>
              </div>
            </div>
            {/* Total amount */}
            <div className="flex justify-between items-center pt-2">
              <p className="font-bold">Order Total</p>
              <p className="font-bold">$49.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Billing information section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First name field */}
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

              {/* Last name field */}
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
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City, State, Zip in responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* City field */}
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

              {/* State dropdown */}
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

              {/* Zip code field */}
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
          </div>

          {/* Payment information section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            <div className="space-y-6">
              {/* Card type dropdown */}
              <FormField
                control={form.control}
                name="cardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Type *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Card Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visa">Visa</SelectItem>
                          <SelectItem value="mastercard">Mastercard</SelectItem>
                          <SelectItem value="amex">American Express</SelectItem>
                          <SelectItem value="discover">Discover</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card number field */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Card Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expiration and security code in responsive grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Expiration month dropdown */}
                    <FormField
                      control={form.control}
                      name="expirationMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Month *</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Generate months 01-12 */}
                                {Array.from({ length: 12 }, (_, i) => {
                                  const month = (i + 1).toString().padStart(2, "0")
                                  return (
                                    <SelectItem key={month} value={month}>
                                      {month}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Expiration year dropdown */}
                    <FormField
                      control={form.control}
                      name="expirationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Year *</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="YYYY" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Generate years from current year + 10 years */}
                                {Array.from({ length: 10 }, (_, i) => {
                                  const year = (new Date().getFullYear() + i).toString()
                                  return (
                                    <SelectItem key={year} value={year}>
                                      {year}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Security code field */}
                <FormField
                  control={form.control}
                  name="securityCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="CVV" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Satisfaction guarantee notice */}
          <div className="bg-primary/10 p-4 rounded-md mb-6">
            <h3 className="font-bold mb-2">100% SATISFACTION GUARANTEE</h3>
            <p className="text-sm">
              If, after attending all class sessions, you are in anyway dissatisfied, please let us know and you will
              receive a full refund of the tuition fee and you can keep the Essential Reports valued at $1439 as our
              gift.
            </p>
            <p className="text-sm mt-2 font-medium">You have zero risk...Enroll NOW!</p>
          </div>

          {/* Error message display */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>}

          {/* Submit button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
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
