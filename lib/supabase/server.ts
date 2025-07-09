// Import Supabase SSR (Server-Side Rendering) client for server-side operations
import { createServerClient } from "@supabase/ssr"
// Import Next.js cookies utility for handling cookies on the server
import { cookies } from "next/headers"

// Function to create a Supabase client for server-side operations
// This client is used in server components and server actions
export const createClient = async () => {
  // Get the cookie store from Next.js
  // This allows us to read and write cookies on the server
  const cookieStore = await cookies()

  // Create and return the Supabase server client
  // This client can be used to query the database from the server
  return createServerClient("https://supabase.co", process.env.anon_public_key || "", {
    // Configure cookie handling for authentication
    cookies: {
      // Function to get a cookie value by name
      get(name) {
        return cookieStore.get(name)?.value
      },
      // Function to set a cookie with name, value, and options
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      // Function to remove a cookie by setting its value to empty
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}
