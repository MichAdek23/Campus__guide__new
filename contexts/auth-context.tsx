"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { getGlobalSupabaseClient, getGlobalClientInfo } from "@/lib/supabase/global-singleton"
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  useEffect(() => {
    mountedRef.current = true

    // Log client info for debugging
    console.log("🔍 Auth Context - Global Client Info:", getGlobalClientInfo())

    const initializeAuth = async () => {
      try {
        // Get the global client - this should be the same instance every time
        const supabaseClient = getGlobalSupabaseClient()

        // Get initial session
        const {
          data: { session },
          error,
        } = await supabaseClient.auth.getSession()

        if (error) {
          console.error("Error getting initial session:", error)
        }

        if (mountedRef.current) {
          setUser(session?.user || null)
          setLoading(false)
        }

        // Clean up any existing subscription
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe()
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabaseClient.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
          console.log("🔐 Auth state change:", event, session?.user?.email || "no user")

          if (mountedRef.current) {
            setUser(session?.user || null)
            setLoading(false)
          }
        })

        subscriptionRef.current = subscription
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Cleanup function
    return () => {
      mountedRef.current = false
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, []) // Empty dependency array - no dependencies needed

  const signIn = useCallback(async (email: string, password: string) => {
    const client = getGlobalSupabaseClient()
    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }, [])

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    const client = getGlobalSupabaseClient()
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    const client = getGlobalSupabaseClient()
    const { error } = await client.auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const client = getGlobalSupabaseClient()
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
