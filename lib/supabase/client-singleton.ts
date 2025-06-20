import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = "https://hmwnqimmgysxmtsckvin.supabase.co"
    const supabaseAnonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs"

    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return supabaseClient
}

// For testing purposes - allows resetting the singleton
export function resetSupabaseClient() {
  supabaseClient = null
}
