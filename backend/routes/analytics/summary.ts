import { NextResponse, NextRequest } from "next/server"
import prisma from "../../lib/db"
import { requireAuth } from "../../middleware/auth"

export async function getAnalyticsSummary(request: NextRequest) {
  const user = await requireAuth(request)

  // Check if requireAuth returned an error response
  if (user instanceof NextResponse) {
    return user // Early return if not authenticated
  }

  try {
    // Get the timeframe from the URL
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "7d"

    // Check if we have analytics data
    const analyticsCount = await prisma.analyticsData.count()

    // If no data exists, create some initial data
    if (analyticsCount === 0) {
      // Generate data for the last 90 days
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 90)

      for (let i = 0; i < 90; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)

        // Generate random metrics
        const securityScore = Math.floor(Math.random() * 10) + 90
        const encryptionStrength = Math.floor(Math.random() * 5) + 95
        const threatIndex = Math.floor(Math.random() * 10)
        const keyExchanges = Math.floor(Math.random() * 100) + 50
        const activeConnections = Math.floor(Math.random() * 2000) + 500
        const dataTransferred = Math.floor(Math.random() * 10000) + 1000 // in MB

        // Insert analytics data
        await prisma.analyticsData.create({
          data: {
            date: date, // Use Date object directly
            securityScore: securityScore,
            encryptionStrength: encryptionStrength,
            threatIndex: threatIndex,
            keyExchanges: keyExchanges,
            activeConnections: activeConnections,
            dataTransferred: dataTransferred,
            metadata: JSON.stringify({
              protocols: {
                BB84: Math.floor(Math.random() * 60) + 40,
                E91: Math.floor(Math.random() * 20) + 10,
                B92: Math.floor(Math.random() * 10) + 5,
                "Six-State": Math.floor(Math.random() * 10) + 5,
              },
            }),
          },
        })
      }
    }

    // Determine the date range based on timeframe
    let startDateRange: Date
    const endDateRange = new Date()

    switch (timeframe) {
      case "24h":
        startDateRange = new Date(endDateRange)
        startDateRange.setDate(startDateRange.getDate() - 1)
        break
      case "7d":
        startDateRange = new Date(endDateRange)
        startDateRange.setDate(startDateRange.getDate() - 7)
        break
      case "30d":
        startDateRange = new Date(endDateRange)
        startDateRange.setDate(startDateRange.getDate() - 30)
        break
      case "90d":
        startDateRange = new Date(endDateRange)
        startDateRange.setDate(startDateRange.getDate() - 90)
        break
      default:
        startDateRange = new Date(endDateRange)
        startDateRange.setDate(startDateRange.getDate() - 7)
    }

    // Get analytics data for the specified timeframe
    const data = await prisma.analyticsData.findMany({
      where: {
        date: {
          gte: startDateRange,
          lte: endDateRange,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Handle case where no data exists for the timeframe
    if (data.length === 0) {
      // Return a response indicating no data or default values
      return NextResponse.json({
        timeframe,
        security_score: 0,
        security_score_trend: "+0.0%",
        encryption_strength: 0,
        encryption_strength_trend: "+0.0%",
        threat_index: 0,
        threat_index_trend: "+0.0%",
        logs: [],
        chart_data: [],
        message: "No analytics data available for the selected timeframe.",
      })
    }

    // Get the latest data point
    const latestData = data[data.length - 1]

    // Calculate trends (comparing to the first data point in the range)
    const firstData = data[0]
    const securityScoreTrend = (
      ((latestData.securityScore - firstData.securityScore) / firstData.securityScore) *
      100
    ).toFixed(1)
    const encryptionStrengthTrend = (
      ((latestData.encryptionStrength - firstData.encryptionStrength) /
        firstData.encryptionStrength) *
      100
    ).toFixed(1)
    const threatIndexTrend = (
      ((latestData.threatIndex - firstData.threatIndex) /
        (firstData.threatIndex || 1)) *
      100
    ).toFixed(1)

    // Get security logs for the specified timeframe
    const logs = await prisma.securityLog.findMany({
      where: {
        timestamp: {
          gte: startDateRange,
          lte: endDateRange,
        },
        // Optionally filter by user ID if applicable
        // userId: user.id,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
    })

    // Format logs for the response
    const formattedLogs = logs.map((log) => ({
      timestamp: `${new Date(log.timestamp).toISOString().split("T")[0]} ${new Date(log.timestamp).toTimeString().split(" ")[0]}`,
      eventType: log.eventType, // Use camelCase
      description: log.description,
      severity: log.severity,
    }))

    return NextResponse.json({
      timeframe,
      security_score: latestData.securityScore, // Use camelCase
      security_score_trend: `${securityScoreTrend.startsWith("-") ? "" : "+"}${securityScoreTrend}%`,
      encryption_strength: latestData.encryptionStrength, // Use camelCase
      encryption_strength_trend: `${encryptionStrengthTrend.startsWith("-") ? "" : "+"}${encryptionStrengthTrend}%`,
      threat_index: latestData.threatIndex, // Use camelCase
      threat_index_trend: `${threatIndexTrend.startsWith("-") ? "" : "+"}${threatIndexTrend}%`,
      logs: formattedLogs,
      chart_data: data.map((item) => ({
        date: item.date.toISOString().split("T")[0], // Format date back to string for response
        security_score: item.securityScore, // Use camelCase
        encryption_strength: item.encryptionStrength, // Use camelCase
        threat_index: item.threatIndex, // Use camelCase
        key_exchanges: item.keyExchanges, // Use camelCase
      })),
    })
  } catch (error) {
    console.error("Error in analytics summary API:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
