import { getGlobalSupabaseClient } from "./global-singleton"

// Export the global singleton client
export const supabase = getGlobalSupabaseClient()

// Re-export functions
export { getGlobalSupabaseClient, hasGlobalSupabaseClient, getGlobalClientInfo } from "./global-singleton"

// Default export
export default supabase
