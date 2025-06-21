import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

/**
 * Server-side client - this is separate from the browser singleton
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    "https://hmwnqimmgysxmtsckvin.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )
}

// Export as default for backward compatibility
export const serverClient = createServerSupabaseClient
