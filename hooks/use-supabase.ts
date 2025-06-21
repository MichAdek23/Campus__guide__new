"use client";

import { useMemo } from "react";
import { getGlobalSupabaseClient } from "@/lib/supabase/global-singleton.ts";

/**
 * Tiny helper so components just `const supabase = useSupabase()`
 */
export function useSupabase() {
  return useMemo(() => getGlobalSupabaseClient(), []);
}

/**
 * Hook for auth-specific operations
 */
export function useSupabaseAuth() {
  const client = useSupabase();
  return client.auth;
}

/**
 * Hook for database operations
 */
export function useSupabaseDb() {
  const client = useSupabase();
  return client;
}
