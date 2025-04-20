import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, comparePasswords, generateToken, setSessionCookie, clearSessionCookie } from "../lib/auth"

export async function register(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    // Log the registration
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: "Authentication",
        description: "User registered",
        severity: "Info",
      },
    })

    return NextResponse.json({
      message: "User registered successfully",
      user,
    })
  } catch (error) {
    console.log("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

export async function login(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isMatch = await comparePasswords(password, user.passwordHash)
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create a session token
    const token = generateToken({ id: user.id, email: user.email })

    // Store the session
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Log the login
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: "Authentication",
        description: "User logged in",
        severity: "Info",
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    // Set the session cookie
    setSessionCookie(token)

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}

export async function logout(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get("qbit_session")

    if (sessionCookie) {
      try {
        // Delete the session from the database
        const session = await prisma.session.findUnique({
          where: {
            token: sessionCookie.value,
          },
          include: {
            user: true,
          },
        })

        if (session) {
          await prisma.session.delete({
            where: {
              token: sessionCookie.value,
            },
          })

          // Log the logout
          await prisma.securityLog.create({
            data: {
              userId: session.userId,
              eventType: "Authentication",
              description: "User logged out",
              severity: "Info",
            },
          })
        }
      } catch (error) {
        console.error("Token verification error:", error)
      }

      // Delete the cookie regardless of token verification
      clearSessionCookie()
    }

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
