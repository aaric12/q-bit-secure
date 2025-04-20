import { NextResponse } from "next/server"
import { executeQuery } from "../../lib/db"
import { requireAuth } from "../../middleware/auth"

export async function getDashboardSummary(request: Request) {
  try {
    // Authenticate the user
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if we have dashboard metrics
    const dashboardMetrics = await executeQuery("SELECT * FROM dashboard_metrics ORDER BY timestamp DESC LIMIT 1")

    // If no metrics exist, create some initial data
    if (dashboardMetrics.length === 0) {
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
      await executeQuery(
        `INSERT INTO dashboard_metrics (
          network_status, active_connections, data_transferred, 
          last_key_exchange, encryption_method, key_length, 
          key_refresh_rate, encryption_strength, connectivity_score, 
          latency_ms, packet_loss, threat_detection_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
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
        ],
      )
    }

    // Get the latest dashboard metrics
    const latestMetrics = await executeQuery("SELECT * FROM dashboard_metrics ORDER BY timestamp DESC LIMIT 1")

    // Get recent security logs for activity feed
    const recentActivity = await executeQuery(
      `SELECT id, user_id, event_type, description, severity, timestamp 
       FROM security_logs 
       WHERE user_id = $1 OR user_id IS NULL
       ORDER BY timestamp DESC LIMIT 10`,
      [user.id],
    )

    // Format the activity data
    const formattedActivity = recentActivity.map((log: any) => ({
      id: `log-${log.id}`,
      type: log.severity === "Alert" ? "alert" : log.severity === "Warning" ? "warning" : "security",
      message: log.description,
      timestamp: log.timestamp,
      status: log.severity === "Alert" ? "Investigating" : undefined,
    }))

    // Format the metrics for the response
    const metrics = latestMetrics[0]
    const lastKeyExchangeTime = new Date(metrics.last_key_exchange)
    const minutesSinceLastExchange = Math.floor((Date.now() - lastKeyExchangeTime.getTime()) / 60000)
    const nextKeyExchangeMinutes = Math.max(0, Math.floor(metrics.key_refresh_rate / 60) - minutesSinceLastExchange)

    return NextResponse.json({
      network_status: metrics.network_status,
      active_connections: metrics.active_connections,
      active_connections_change: Math.floor(Math.random() * 10) + 1, // Mock data for now
      data_transferred: `${(metrics.data_transferred / 1024).toFixed(1)} TB`,
      last_key_exchange: `${minutesSinceLastExchange}m ago`,
      next_key_exchange: `${nextKeyExchangeMinutes} minutes`,
      encryption_method: metrics.encryption_method,
      key_length: metrics.key_length,
      key_refresh_rate: metrics.key_refresh_rate,
      encryption_strength: metrics.encryption_strength,
      connectivity: metrics.connectivity_score === 100 ? "Optimal" : "Good",
      connectivity_score: metrics.connectivity_score,
      latency: `${metrics.latency_ms}ms`,
      latency_score: 100 - metrics.latency_ms / 2,
      packet_loss: `${(metrics.packet_loss * 100).toFixed(2)}%`,
      packet_loss_score: 100 - metrics.packet_loss * 1000,
      threat_detection: metrics.threat_detection_score === 100 ? "None Detected" : "Potential Threat",
      threat_detection_score: metrics.threat_detection_score,
      recent_activity: formattedActivity,
    })
  } catch (error) {
    console.error("Error in dashboard summary API:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
