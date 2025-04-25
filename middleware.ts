import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client for the middleware
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
    },
  })

  // Get the token from the cookie
  const token = req.cookies.get("sb-access-token")?.value

  if (token) {
    // Set the token in the request headers
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data?.user) {
      // If there's an error or no user, redirect to login
      return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }
  } else {
    // If there's no token, redirect to login
    return NextResponse.redirect(new URL("/auth/sign-in", req.url))
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
}
