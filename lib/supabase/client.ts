// Import the Supabase client creation function
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Function to create a Supabase client for client-side operations
// This client is used in components that run in the browser
export const createClient = () => {
  // Get environment variables for Supabase configuration
  // These are set in your .env.local file and are safe to expose to the browser
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Create and return the Supabase client instance
  // This client can be used to query the database from the browser
  return createSupabaseClient(supabaseUrl, supabaseKey)
}
