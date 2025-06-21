import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

/**
 * API route client - only for server-side API routes
 * This should NOT be used in browser components
 */
export function createApiClient() {
  return createClient<Database>(
    "https://hmwnqimmgysxmtsckvin.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs",
    {
      auth: {
        persistSession: false, // Don't persist in API routes
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  )
}
