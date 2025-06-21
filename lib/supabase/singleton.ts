import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

// Global singleton instance - this is the ONLY client that should exist
let supabaseInstance: SupabaseClient<Database> | null = null
let isInitializing = false
let initializationPromise: Promise<SupabaseClient<Database>> | null = null

/**
 * Creates and returns a singleton Supabase client instance.
 * This prevents multiple GoTrueClient instances from being created.
 */
export function createSupabaseSingleton(): Promise<SupabaseClient<Database>> {
  // Return existing instance if already created
  if (supabaseInstance) {
    return Promise.resolve(supabaseInstance)
  }

  // Return existing initialization promise if already initializing
  if (initializationPromise) {
    return initializationPromise
  }

  // Create new initialization promise
  initializationPromise = new Promise((resolve, reject) => {
    if (isInitializing) {
      reject(new Error("Supabase client is already being initialized"))
      return
    }

    isInitializing = true

    try {
      const supabaseUrl = "https://hmwnqimmgysxmtsckvin.supabase.co"
      const supabaseAnonKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs"

      // Create the singleton instance with unique configuration
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // Use a unique storage key to prevent conflicts
          storageKey: `campus-guide-auth-${Date.now()}`,
          // Ensure we use the browser's localStorage
          storage: typeof window !== "undefined" ? window.localStorage : undefined,
        },
        // Prevent multiple clients from interfering with each other
        global: {
          headers: {
            "X-Client-Info": `campus-guide-singleton-${Date.now()}`,
          },
        },
      })

      console.log("✅ Supabase singleton client created successfully")
      isInitializing = false
      resolve(supabaseInstance)
    } catch (error) {
      isInitializing = false
      initializationPromise = null
      reject(error)
    }
  })

  return initializationPromise
}

/**
 * Get the existing singleton instance (synchronous)
 */
export function getSupabaseSingleton(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    // Create synchronously for immediate use
    const supabaseUrl = "https://hmwnqimmgysxmtsckvin.supabase.co"
    const supabaseAnonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtd25xaW1tZ3lzeG10c2NrdmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2Nzg0NzUsImV4cCI6MjA2MTI1NDQ3NX0.kogAFlbsquAldlzquD5eAwM-H8O31mIM40rp7_GxrLs"

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "campus-guide-singleton-auth",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
      global: {
        headers: {
          "X-Client-Info": "campus-guide-singleton",
        },
      },
    })

    console.log("✅ Supabase singleton client created synchronously")
  }
  return supabaseInstance
}

/**
 * Get existing instance or create if it doesn't exist (synchronous)
 */
export function getOrCreateSupabaseSingleton(): SupabaseClient<Database> {
  return getSupabaseSingleton()
}

/**
 * Check if singleton is initialized
 */
export function isSupabaseSingletonInitialized(): boolean {
  return supabaseInstance !== null
}

/**
 * Reset singleton (for testing only)
 */
export function resetSupabaseSingleton(): void {
  if (process.env.NODE_ENV !== "test") {
    console.warn("⚠️ resetSupabaseSingleton should only be used in tests")
  }
  supabaseInstance = null
  isInitializing = false
  initializationPromise = null
}

/**
 * Get client info for debugging
 */
export function getClientInfo() {
  return {
    isInitialized: isSupabaseSingletonInitialized(),
    isInitializing,
    clientId: supabaseInstance ? "singleton-instance" : "not-created",
    hasInitPromise: initializationPromise !== null,
  }
}
