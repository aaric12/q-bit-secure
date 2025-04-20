import { NextResponse } from "next/server"
import prisma from "../../../../backend/lib/db" // Corrected import path
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function POST() {
  try {
    const cookieStore = await cookies() // Await cookies
    const sessionCookie = cookieStore.get("qbit_session")

    if (sessionCookie) {
      // Verify and decode the token
      try {
        const decoded = verify(sessionCookie.value, process.env.JWT_SECRET || "qbit-secure-secret") as { id: number }

        // Delete the session from the database
        await prisma.session.deleteMany({
          where: {
            userId: decoded.id,
            token: sessionCookie.value,
          },
        })

        // Log the logout
        await prisma.securityLog.create({
          data: {
            userId: decoded.id,
            eventType: "Authentication",
            description: "User logged out",
            severity: "Info",
          },
        })
      } catch (error) {
        console.error("Token verification error:", error)
        // Don't delete cookie if token is invalid? Or maybe delete anyway?
        // Current logic deletes anyway.
      }

      // Delete the cookie regardless of token verification
      cookieStore.delete("qbit_session") // Use the awaited cookieStore
    }

    // Prepare response *before* modifying cookies
    const response = NextResponse.json({ message: "Logged out successfully" })

    // Ensure the cookie is cleared on the response
    response.cookies.set({
      name: "qbit_session",
      value: "",
      path: "/",
      maxAge: -1, // Expire the cookie immediately
    })

    return response

  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
