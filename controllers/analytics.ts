import { type NextRequest, NextResponse } from "next/server"
import prisma from "../lib/prisma"
import { requireAuth } from "../lib/auth"

export async function getAnalyticsSummary(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the timeframe from the URL
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "7d"

    // Check if we have analytics data
    const analyticsDataCount = await prisma.analyticsData.count()

    // If no data exists, create some initial data
    if (analyticsDataCount === 0) {
      // Generate data for the last 90 days
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 90)

      const analyticsData = []
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

        analyticsData.push({
          date,
          securityScore,
          encryptionStrength,
          threatIndex,
          keyExchanges,
          activeConnections,
          dataTransferred,
          metadata: {
            protocols: {
              BB84: Math.floor(Math.random() * 60) + 40,
              E91: Math.floor(Math.random() * 20) + 10,
              B92: Math.floor(Math.random() * 10) + 5,
              "Six-State": Math.floor(Math.random() * 10) + 5,
            },
          },
        })
      }

      // Insert analytics data
      await prisma.analyticsData.createMany({
        data: analyticsData,
      })
    }

    // Determine the date range based on timeframe
    let startDate
    const endDate = new Date()

    switch (timeframe) {
      case "24h":
        startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 1)
        break
      case "7d":
        startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get analytics data for the specified timeframe
    const data = await prisma.analyticsData.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    })

    // Get the latest data point
    const latestData = data[data.length - 1]

    // Calculate trends (comparing to the first data point in the range)
    const firstData = data[0]
    const securityScoreTrend = (
      ((latestData.securityScore - firstData.securityScore) / firstData.securityScore) *
      100
    ).toFixed(1)
    const encryptionStrengthTrend = (
      ((latestData.encryptionStrength - firstData.encryptionStrength) / firstData.encryptionStrength) *
      100
    ).toFixed(1)
    const threatIndexTrend = (
      ((latestData.threatIndex - firstData.threatIndex) / (firstData.threatIndex || 1)) *
      100
    ).toFixed(1)

    // Get security logs for the specified timeframe
    const logs = await prisma.securityLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
    })

    // Format logs for the response
    const formattedLogs = logs.map((log) => ({
      timestamp: `${log.timestamp.toISOString().split("T")[0]} ${log.timestamp.toTimeString().split(" ")[0]}`,
      event_type: log.eventType,
      description: log.description,
      severity: log.severity,
    }))

    return NextResponse.json({
      timeframe,
      security_score: latestData.securityScore,
      security_score_trend: `${securityScoreTrend.startsWith("-") ? "" : "+"}${securityScoreTrend}%`,
      encryption_strength: latestData.encryptionStrength,
      encryption_strength_trend: `${encryptionStrengthTrend.startsWith("-") ? "" : "+"}${encryptionStrengthTrend}%`,
      threat_index: latestData.threatIndex,
      threat_index_trend: `${threatIndexTrend.startsWith("-") ? "" : "+"}${threatIndexTrend}%`,
      logs: formattedLogs,
      chart_data: data.map((item) => ({
        date: item.date.toISOString().split("T")[0],
        security_score: item.securityScore,
        encryption_strength: item.encryptionStrength,
        threat_index: item.threatIndex,
        key_exchanges: item.keyExchanges,
      })),
    })
  } catch (error) {
    console.error("Error in analytics summary API:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}
