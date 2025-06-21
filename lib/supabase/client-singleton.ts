import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

// Global singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null

/**
 * Creates and returns a singleton Supabase client instance.
 * This prevents multiple GoTrueClient instances from being created.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  // Return existing instance if it exists
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Create new instance only if none exists
  const supabaseUrl = "https://hmwnqimmgysxmtsckvin.supabase.co"
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs"

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "sb-hmwnqimmgysxmtsckvin-auth-token",
    },
  })

  return supabaseInstance
}

/**
 * Reset the singleton instance (for testing or cleanup)
 */
export function resetSupabaseClient() {
  supabaseInstance = null
}

/**
 * Check if client is initialized
 */
export function isClientInitialized(): boolean {
  return supabaseInstance !== null
}
