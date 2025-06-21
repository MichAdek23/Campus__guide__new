import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

/**
 * A **true** browser-wide singleton.
 *  • Lives on `globalThis` so it survives hot-reloads & page changes
 *  • Falls back to a fresh client on the server (every request)
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Fail fast – it’s easier to debug a deployment than random runtime errors
  throw new Error("Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
}

// We’ll store the client on globalThis so it’s reused.
const GLOBAL_KEY = "__CAMPUS_GUIDE_SUPABASE__" as const

function createBrowserClient(): SupabaseClient<Database> {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "campus-guide-auth",
    },
    global: {
      headers: { "X-Client-Name": "campus-guide" },
    },
  })
}

/**
 * Return the singleton Supabase client.
 * On the server: you always get a fresh instance (safe for RSC).
 * In the browser: you always get the same instance.
 */
export function getGlobalSupabaseClient(): SupabaseClient<Database> {
  // Server-side (no window / no globalThis storage)
  if (typeof window === "undefined") return createBrowserClient()

  // Browser – reuse or create once.
  const anyGlobal = globalThis as { [GLOBAL_KEY]?: SupabaseClient<Database> }
  if (!anyGlobal[GLOBAL_KEY]) {
    // eslint-disable-next-line no-console
    console.log("🆕 Creating global Supabase client")
    anyGlobal[GLOBAL_KEY] = createBrowserClient()
  } else {
    // eslint-disable-next-line no-console
    console.log("🔄 Re-using global Supabase client")
  }

  return anyGlobal[GLOBAL_KEY]!
}

export function hasGlobalSupabaseClient() {
  return typeof window !== "undefined" && Boolean((globalThis as any)[GLOBAL_KEY])
}

export function resetGlobalSupabaseClient() {
  if (typeof window !== "undefined") {
    delete (globalThis as any)[GLOBAL_KEY]
  }
}

export function getGlobalClientInfo() {
  return {
    isBrowser: typeof window !== "undefined",
    exists: hasGlobalSupabaseClient(),
    key: GLOBAL_KEY,
    url: SUPABASE_URL,
  }
}
