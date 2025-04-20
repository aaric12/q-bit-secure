import { NextResponse } from "next/server"
import prisma from "../../lib/db"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function logout() {
  try {
    const sessionCookie = (await cookies()).get("qbit_session")

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
      }

      // Delete the cookie regardless of token verification
      (await cookies()).delete("qbit_session")
    }

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
