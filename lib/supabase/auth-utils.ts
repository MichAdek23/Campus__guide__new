import { getSupabaseClient } from "./client-singleton"

export function createAuthClient() {
  return getSupabaseClient()
}
