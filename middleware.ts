import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Define which paths require authentication
const protectedPaths = ["/dashboard", "/analytics", "/security", "/simulation"]

// Define which paths are for non-authenticated users only
const authPaths = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Get the session token from the cookies
  const sessionCookie = request.cookies.get("qbit_session")
  const isAuthenticated = sessionCookie ? await verifyToken(sessionCookie.value) : null

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.some((authPath) => path.startsWith(authPath))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/analytics/:path*", "/security/:path*", "/simulation/:path*", "/login", "/register"],
}
