"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// Define schema for registration data
const registrationSchema = z.object({
  eventId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phone: z.string(),
  email: z.string().email(),
  guestName: z.string().optional(),
  confirmEvent: z.boolean(),
})

// Define schema for payment data
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

// Register attendee
export async function registerAttendee(formData: any) {
  try {
    // Validate form data
    const validatedData = registrationSchema.parse(formData)

    // Create Supabase client
    const supabase = createClient()

    // Insert registration data into database
    const { data, error } = await supabase
      .from("registrations")
      .insert({
        event_id: validatedData.eventId,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        address: validatedData.address,
        city: validatedData.city,
        state: validatedData.state,
        zip_code: validatedData.zipCode,
        phone: validatedData.phone,
        email: validatedData.email,
        guest_name: validatedData.guestName || null,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error registering attendee:", error)
      return { success: false, error: "Failed to register. Please try again." }
    }

    return { success: true, registrationId: data.id }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Invalid form data. Please check your inputs." }
  }
}

// Process payment
export async function processPayment(formData: any) {
  try {
    // Validate form data
    const validatedData = paymentSchema.parse(formData)

    // Create Supabase client
    const supabase = createClient()

    // In a real application, you would integrate with Stripe here
    // For this demo, we'll simulate a successful payment

    // Insert payment data into database
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        registration_id: validatedData.registrationId,
        amount: 49.0,
        status: "completed",
        payment_method: validatedData.cardType,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (paymentError) {
      console.error("Error processing payment:", paymentError)
      return { success: false, error: "Failed to process payment. Please try again." }
    }

    // Update registration status to 'paid'
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ status: "paid" })
      .eq("id", validatedData.registrationId)

    if (updateError) {
      console.error("Error updating registration status:", updateError)
      // Payment was processed but registration status update failed
      // In a real application, you would handle this case more gracefully
    }

    // In a real application, you would send a confirmation email here using Resend

    return { success: true, paymentId: paymentData.id }
  } catch (error) {
    console.error("Payment error:", error)
    return { success: false, error: "Invalid payment data. Please check your inputs." }
  }
}
