import { NextResponse, NextRequest } from "next/server"
import prisma from "../../../../backend/lib/db" // Corrected import path
import type { SecurityLog, DashboardMetric } from "@prisma/client" // Import types
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function GET(request: NextRequest) { // Add request param, use NextRequest
  try {
    // Get the user ID from the session
    const cookieStore = await cookies() // Await cookies
    const sessionCookie = cookieStore.get("qbit_session")
    if (!sessionCookie?.value) { // Check for existence and value
      return NextResponse.json({ error: "Unauthorized: No session cookie" }, { status: 401 })
    }

    let decodedPayload: { id: number } | null = null
    try {
      // Verify the JWT token structure and signature first
      decodedPayload = verify(sessionCookie.value, process.env.JWT_SECRET || "qbit-secure-secret") as { id: number }
    } catch (error) {
      console.error("JWT Verification Error:", error)
      // Clear potentially invalid cookie
      const response = NextResponse.json({ error: "Invalid session: JWT verification failed" }, { status: 401 })
      response.cookies.set({ name: "qbit_session", value: "", maxAge: -1, path: "/" })
      return response
    }

    // Now, check if the session exists and is valid in the database
    const session = await prisma.session.findFirst({
      where: {
        token: sessionCookie.value,
        userId: decodedPayload.id, // Ensure token belongs to the user in JWT
        expiresAt: {
          gt: new Date(), // Check if expiry date is greater than now
        },
      },
    })

    if (!session) {
      console.warn("Session not found in DB or expired for token:", sessionCookie.value)
      // Clear the cookie as the session is invalid
      const response = NextResponse.json({ error: "Invalid session: Session not found or expired" }, { status: 401 })
      response.cookies.set({ name: "qbit_session", value: "", maxAge: -1, path: "/" })
      return response
    }

    // If we reach here, the session is valid
    const userId = session.userId // Use userId from the validated DB session

    // Check if we have dashboard metrics
    let latestMetrics = await prisma.dashboardMetric.findFirst({
      orderBy: {
        timestamp: "desc",
      },
    })

    // If no metrics exist, create some initial data
    if (!latestMetrics) {
      const networkStatus = Math.random() > 0.9 ? "Warning" : "Secure"
      const activeConnections = Math.floor(Math.random() * 2000) + 500
      const dataTransferred = Math.floor(Math.random() * 2000) + 500 // in MB
      const lastKeyExchange = new Date()
      const encryptionMethod = "BB84 Quantum Protocol"
      const keyLength = 256
      const keyRefreshRate = 3600
      const encryptionStrength = 98
      const connectivityScore = 100
      const latencyMs = Math.floor(Math.random() * 50) + 10
      const packetLoss = Math.random() * 0.1
      const threatDetectionScore = Math.random() > 0.9 ? 70 : 100

      // Insert initial dashboard metrics
      latestMetrics = await prisma.dashboardMetric.create({
        data: {
          networkStatus,
          activeConnections,
          dataTransferred,
          lastKeyExchange,
          encryptionMethod,
          keyLength,
          keyRefreshRate,
          encryptionStrength,
          connectivityScore,
          latencyMs,
          packetLoss,
          threatDetectionScore,
        },
      })
    }

    // Get recent security logs for activity feed (user-specific or system-wide)
    const recentActivity = await prisma.securityLog.findMany({
      where: {
        OR: [
          { userId: userId },
          { userId: null },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
      select: { // Select only necessary fields
        id: true,
        userId: true,
        eventType: true,
        description: true,
        severity: true,
        timestamp: true,
      },
    })

    // Format the activity data
    const formattedActivity = recentActivity.map((log: Pick<SecurityLog, 'id' | 'severity' | 'description' | 'timestamp'>) => ({ // Add type
      id: `log-${log.id}`,
      type: log.severity === "Alert" ? "alert" : log.severity === "Warning" ? "warning" : "security",
      message: log.description,
      timestamp: log.timestamp,
      status: log.severity === "Alert" ? "Investigating" : undefined,
    }))

    // Format the metrics for the response
    const metrics = latestMetrics // Use the variable we already have
    const lastKeyExchangeTime = new Date(metrics.lastKeyExchange ?? Date.now())
    const minutesSinceLastExchange = Math.floor((Date.now() - lastKeyExchangeTime.getTime()) / 60000)
    const nextKeyExchangeMinutes = Math.max(0, Math.floor(metrics.keyRefreshRate / 60) - minutesSinceLastExchange)

    return NextResponse.json({
      network_status: metrics.networkStatus,
      active_connections: metrics.activeConnections,
      active_connections_change: Math.floor(Math.random() * 10) + 1, // Mock data for now
      data_transferred: `${(Number(metrics.dataTransferred) / 1024).toFixed(1)} TB`,
      last_key_exchange: `${minutesSinceLastExchange}m ago`,
      next_key_exchange: `${nextKeyExchangeMinutes} minutes`,
      encryption_method: metrics.encryptionMethod,
      key_length: metrics.keyLength,
      key_refresh_rate: metrics.keyRefreshRate,
      encryption_strength: metrics.encryptionStrength,
      connectivity: metrics.connectivityScore === 100 ? "Optimal" : "Good",
      connectivity_score: metrics.connectivityScore,
      latency: `${metrics.latencyMs}ms`,
      latency_score: 100 - metrics.latencyMs / 2,
      packet_loss: `${(metrics.packetLoss * 100).toFixed(2)}%`,
      packet_loss_score: 100 - metrics.packetLoss * 1000,
      threat_detection: metrics.threatDetectionScore === 100 ? "None Detected" : "Potential Threat",
      threat_detection_score: metrics.threatDetectionScore,
      recent_activity: formattedActivity,
    })
  } catch (error) {
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
