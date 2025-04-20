import { type NextRequest, NextResponse } from "next/server"
import prisma from "../lib/prisma"
import { requireAuth } from "../lib/auth"

export async function getDashboardSummary(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if we have dashboard metrics
    const dashboardMetricsCount = await prisma.dashboardMetric.count()

    // If no metrics exist, create some initial data
    if (dashboardMetricsCount === 0) {
      // Generate random data for the dashboard
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
      await prisma.dashboardMetric.create({
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

    // Get the latest dashboard metrics
    const latestMetrics = await prisma.dashboardMetric.findFirst({
      orderBy: {
        timestamp: "desc",
      },
    })

    // Get recent security logs for activity feed
    const recentActivity = await prisma.securityLog.findMany({
      where: {
        OR: [{ userId: user.id }, { userId: null }],
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
    })

    // Format the activity data
    const formattedActivity = recentActivity.map((log) => ({
      id: `log-${log.id}`,
      type: log.severity === "Alert" ? "alert" : log.severity === "Warning" ? "warning" : "security",
      message: log.description,
      timestamp: log.timestamp.toISOString(),
      status: log.severity === "Alert" ? "Investigating" : undefined,
    }))

    // Format the metrics for the response
    const metrics = latestMetrics!
    const lastKeyExchangeTime = metrics.lastKeyExchange || new Date()
    const minutesSinceLastExchange = Math.floor((Date.now() - lastKeyExchangeTime.getTime()) / 60000)
    const nextKeyExchangeMinutes = Math.max(0, Math.floor(metrics.keyRefreshRate / 60) - minutesSinceLastExchange)

    return NextResponse.json({
      network_status: metrics.networkStatus,
      active_connections: metrics.activeConnections,
      active_connections_change: Math.floor(Math.random() * 10) + 1, // Mock data for now
      data_transferred: `${(metrics.dataTransferred / 1024).toFixed(1)} TB`,
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
