"use client"

import { useEffect } from "react"
import { getGlobalSupabaseClient, getGlobalClientInfo } from "@/lib/supabase/global-singleton"

export function ClientInitializer() {
  useEffect(() => {
    // Initialize the global client early
    const client = getGlobalSupabaseClient()
    console.log("🚀 Client Initializer - Global Client Info:", getGlobalClientInfo())
  }, [])

  return null // This component doesn't render anything
}
