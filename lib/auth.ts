import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sign } from "jsonwebtoken"
import { prisma } from "./prisma"

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Helper function to compare passwords
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Helper function to generate JWT token
export function generateToken(payload: any): string {
  return sign(payload, process.env.JWT_SECRET || "qbit-secure-secret", {
    expiresIn: "7d",
  })
}

// Helper function to verify JWT token
export async function verifyToken(token: string): Promise<{ id: number; email: string } | null> {
  try {
    const decoded = verify(token, process.env.JWT_SECRET || "qbit-secure-secret") as { id: number; email: string }

    // Check if the session exists in the database
    const session = await prisma.session.findUnique({
      where: {
        token,
      },
    })

    if (!session || new Date(session.expiresAt) < new Date()) {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

// Middleware to check if user is authenticated
export async function requireAuth(request: NextRequest) {
  const sessionCookie = request.cookies.get("qbit_session")

  if (!sessionCookie) {
    return null
  }

  const user = await verifyToken(sessionCookie.value)
  return user
}

// Helper function to set session cookie
export function setSessionCookie(token: string) {
  cookies().set({
    name: "qbit_session",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

// Helper function to clear session cookie
export function clearSessionCookie() {
  cookies().delete("qbit_session")
}
