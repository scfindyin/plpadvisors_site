// Import Stripe SDK for server-side payment processing
import Stripe from "stripe"
// Import Next.js server response utilities
import { NextResponse } from "next/server"

// Initialize Stripe with the secret key from environment variables
// The "!" asserts that the key exists (TypeScript non-null assertion)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session and redirects the user to Stripe's
 * hosted payment page. This is the simplest Stripe integration - Stripe
 * handles all the payment UI, validation, and PCI compliance.
 *
 * Flow:
 * 1. User clicks "Buy Now" button (form POST to this route)
 * 2. This route creates a Checkout Session with product details
 * 3. User is redirected to Stripe's hosted checkout page
 * 4. After payment, user is redirected to /success or back to home (cancel)
 */
export async function POST() {
  try {
    // Create a Checkout Session with the class registration product
    // Using price_data for inline pricing (no need to create products in Stripe Dashboard)
    const session = await stripe.checkout.sessions.create({
      // Define what the customer is purchasing
      line_items: [
        {
          // price_data allows us to define the product inline without creating it in Stripe first
          price_data: {
            currency: "usd",
            // Product information shown on the checkout page
            product_data: {
              name: "New Retirement Rules™ Class Registration",
              description: "Includes admission for you and a guest, workbook, and essential reports valued at $1,439",
            },
            // Amount in cents ($49.00 = 4900 cents)
            unit_amount: 4900,
          },
          quantity: 1,
        },
      ],
      // "payment" mode for one-time payments (vs "subscription" for recurring)
      mode: "payment",
      // Where to redirect after successful payment
      // {CHECKOUT_SESSION_ID} is replaced by Stripe with the actual session ID
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Where to redirect if user cancels/closes the checkout
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/`,
    })

    // Redirect to Stripe's hosted checkout page
    // 303 is the proper status code for POST-redirect-GET pattern
    return NextResponse.redirect(session.url!, 303)
  } catch (error) {
    // Log the error for debugging (visible in server console/logs)
    console.error("Stripe checkout error:", error)
    // Return a generic error to the client (don't expose internal details)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
