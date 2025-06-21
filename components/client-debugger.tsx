"use client"

import { useEffect, useState } from "react"
import { getClientInfo } from "@/lib/supabase/singleton"

/**
 * Development component to monitor client instances
 * Remove this in production
 */
export function ClientDebugger() {
  const [clientInfo, setClientInfo] = useState(getClientInfo())

  useEffect(() => {
    const interval = setInterval(() => {
      setClientInfo(getClientInfo())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
      <div>Client Status: {clientInfo.isInitialized ? "✅ Initialized" : "❌ Not Initialized"}</div>
      <div>Initializing: {clientInfo.isInitializing ? "⏳ Yes" : "✅ No"}</div>
      <div>Client ID: {clientInfo.clientId}</div>
    </div>
  )
}
