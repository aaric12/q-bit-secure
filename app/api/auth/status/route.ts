import { NextResponse, NextRequest } from "next/server"
import prisma from "../../../../backend/lib/db"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("qbit_session")

    if (!sessionCookie?.value) {
      return NextResponse.json({ isAuthenticated: false, error: "No session cookie" }, { status: 401 })
    }

    let decodedPayload: { id: number } | null = null
    try {
      decodedPayload = verify(sessionCookie.value, process.env.JWT_SECRET || "qbit-secure-secret") as { id: number }
    } catch (error) {
      // JWT verification failed (expired, invalid signature etc.)
      return NextResponse.json({ isAuthenticated: false, error: "Invalid token" }, { status: 401 })
    }

    // Check session in DB
    const session = await prisma.session.findFirst({
      where: {
        token: sessionCookie.value,
        userId: decodedPayload.id,
        expiresAt: { gt: new Date() },
      },
      select: { userId: true } // Only select needed field
    })

    if (!session) {
      // Valid JWT but no matching session in DB or expired
      return NextResponse.json({ isAuthenticated: false, error: "Session not found or expired" }, { status: 401 })
    }

    // Session is valid
    return NextResponse.json({ isAuthenticated: true, userId: session.userId })

  } catch (error) {
    console.error("Auth status check error:", error)
    return NextResponse.json({ isAuthenticated: false, error: "Internal server error" }, { status: 500 })
  }
} 