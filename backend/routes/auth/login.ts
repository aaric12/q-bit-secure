import { NextResponse, NextRequest } from "next/server"
import prisma from "../../lib/db"
import bcrypt from "bcryptjs"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

export async function login(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create a session token
    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "qbit-secure-secret", {
      expiresIn: "7d",
    })

    // Store the session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.session.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: expiresAt,
      },
    })

    // Log the login
    // Get IP address correctly from headers
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("remote-addr") || "unknown"
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: "Authentication",
        description: "User logged in",
        severity: "Info",
        ipAddress: ipAddress,
      },
    })

    // Create the response object BEFORE setting cookies
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

    // Set the session cookie on the response
    response.cookies.set({
      name: "qbit_session",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response // Return the response with the cookie set

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
