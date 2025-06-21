"use client"

import { getOrCreateSupabaseSingleton } from "./singleton"

// Intercept any attempts to create new clients
const originalCreateClient = require("@supabase/supabase-js").createClient

// Override the createClient function in browser context
if (typeof window !== "undefined") {
  const { createClient } = require("@supabase/supabase-js")

  // Replace createClient with our singleton
  Object.defineProperty(require("@supabase/supabase-js"), "createClient", {
    value: (...args: any[]) => {
      console.warn("🚫 Intercepted createClient call - using singleton instead")
      return getOrCreateSupabaseSingleton()
    },
    writable: false,
    configurable: false,
  })
}

export { getOrCreateSupabaseSingleton as createClient }
