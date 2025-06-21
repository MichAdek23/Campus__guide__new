import { getGlobalSupabaseClient } from "./global-singleton"

/**
 * Get the global singleton auth client
 */
export function createAuthClient() {
  return getGlobalSupabaseClient()
}

/**
 * Get auth client (same as createAuthClient)
 */
export function getAuthClient() {
  return getGlobalSupabaseClient()
}

/**
 * Get current user from global client
 */
export async function getCurrentUser() {
  const client = getGlobalSupabaseClient()
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error) {
    console.error("Error getting current user:", error)
    return null
  }

  return user
}

/**
 * Get current session from global client
 */
export async function getCurrentSession() {
  const client = getGlobalSupabaseClient()
  const {
    data: { session },
    error,
  } = await client.auth.getSession()

  if (error) {
    console.error("Error getting current session:", error)
    return null
  }

  return session
}
