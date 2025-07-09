// This file contains server actions - functions that run on the server side
// Server actions are a Next.js 13+ feature that allows you to call server functions directly from client components
"use server"

// Import Supabase client for server-side database operations
import { createClient } from "@/lib/supabase/server"
// Import Zod for data validation
import { z } from "zod"

// Define schema for registration data validation
// This ensures all registration data is properly formatted before saving to database
const registrationSchema = z.object({
  eventId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  email: z.string().email(), // Validates email format
  guestName: z.string().optional(), // Optional field
  confirmEvent: z.boolean(),
})

// Define schema for payment data validation
// This ensures all payment data is properly formatted before processing
const paymentSchema = z.object({
  registrationId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  cardType: z.string(),
  cardNumber: z.string(),
  expirationMonth: z.string(),
  expirationYear: z.string(),
  securityCode: z.string(),
})

// Server action to register an attendee for an event
// This function runs on the server and can be called from client components
export async function registerAttendee(formData: any) {
  try {
    // Validate the incoming form data against our schema
    const validatedData = registrationSchema.parse(formData)

    // Create Supabase client for server-side database operations
    const supabase = await createClient()

    // Insert registration data into the 'registrations' table
    const { data, error } = await supabase
      .from("registrations")
      .insert({
        event_id: validatedData.eventId, // Foreign key to events table
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zip_code: validatedData.zipCode,
        phone: validatedData.phone,
        email: validatedData.email,
        guest_name: validatedData.guestName || null, // Store null if no guest
        status: "pending", // Initial status before payment
        created_at: new Date().toISOString(), // Timestamp
      })
      .select() // Return the inserted data
      .single() // Expect only one record

    // Check if there was an error during database insertion
    if (error) {
      console.error("Error registering attendee:", error)
      return { success: false, error: "Failed to register. Please try again." }
    }

    // Return success with the registration ID for the payment process
    return { success: true, registrationId: data.id }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Invalid form data. Please check your inputs." }
  }
}

// Server action to process payment for a registration
// This function runs on the server and can be called from client components
export async function processPayment(formData: any) {
  try {
    // Validate the incoming payment data against our schema
    const validatedData = paymentSchema.parse(formData)

    // Create Supabase client for server-side database operations
    const supabase = await createClient()

    // In a real application, you would integrate with Stripe here
    // For this demo, we'll simulate a successful payment
    // This is where you would make API calls to your payment processor

    // Insert payment data into the 'payments' table
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        registration_id: validatedData.registrationId, // Foreign key to registrations table
        amount: 49.0, // Fixed amount for this class
        status: "completed", // Payment status
        payment_method: validatedData.cardType, // Type of payment method used
        created_at: new Date().toISOString(), // Timestamp
      })
      .select() // Return the inserted data
      .single() // Expect only one record

    // Check if there was an error during payment processing
    if (paymentError) {
      console.error("Error processing payment:", paymentError)
      return { success: false, error: "Failed to process payment. Please try again." }
    }

    // Update the registration status to 'paid' after successful payment
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ status: "paid" })
      .eq("id", validatedData.registrationId) // Update specific registration

    // Check if there was an error updating the registration status
    if (updateError) {
      console.error("Error updating registration status:", updateError)
      // Payment was processed but registration status update failed
      // In a real application, you would handle this case more gracefully
      // You might want to retry the update or log this for manual intervention
    }

    // In a real application, you would send a confirmation email here using Resend
    // This is where you would integrate with your email service provider

    // Return success with the payment ID for the thank you page
    return { success: true, paymentId: paymentData.id }
  } catch (error) {
    console.error("Payment error:", error)
    return { success: false, error: "Invalid payment data. Please check your inputs." }
  }
}
