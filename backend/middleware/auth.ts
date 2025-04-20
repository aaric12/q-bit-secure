import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"
import prisma from "../lib/db"

// Helper function to verify JWT token
export async function verifyToken(token: string): Promise<{ id: number; email: string } | null> {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "qbit-secure-secret") as { id: number; email: string }

    // Check if the session exists in the database and is not expired
    const session = await prisma.session.findUnique({
      where: {
        token: token,
        expiresAt: {
          gt: new Date(), // Check if expiry date is greater than now
        },
        // Optionally ensure the session belongs to the decoded user ID
        // userId: decoded.id 
      },
    })

    if (!session) {
      return null
    }

    // If session exists and belongs to the right user (implicitly by finding the token)
    // You might want to explicitly return user data stored in the session or user table if needed
    // For now, just returning the decoded token payload
    return decoded
  } catch (error) {
    // Handle JWT verification errors (e.g., expired token, invalid signature)
    console.error("Token verification error:", error)
    return null
  }
}

// Middleware to check if user is authenticated
export async function requireAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get("qbit_session")

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await verifyToken(sessionCookie.value)

  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  // If verification is successful, return the user data from the token
  return user
}
