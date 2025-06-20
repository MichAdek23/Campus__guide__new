import { getSupabaseClient } from "./client-singleton"

// Export the singleton client
export const supabase = getSupabaseClient()

// Also export the getter function for consistency
export { getSupabaseClient }
