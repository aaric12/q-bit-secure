import { NextResponse, NextRequest } from "next/server"
import prisma from "../../../../backend/lib/db" // Corrected import path
import type { SecurityLog, AnalyticsData } from "@prisma/client" // Import types
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    // --- START AUTH CHECK --- 
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("qbit_session")
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized: No session cookie" }, { status: 401 })
    }
    let decodedPayload: { id: number } | null = null
    try {
      decodedPayload = verify(sessionCookie.value, process.env.JWT_SECRET || "qbit-secure-secret") as { id: number }
    } catch (error) {
      console.error("JWT Verification Error:", error)
      const response = NextResponse.json({ error: "Invalid session: JWT verification failed" }, { status: 401 })
      response.cookies.set({ name: "qbit_session", value: "", maxAge: -1, path: "/" })
      return response
    }
    const session = await prisma.session.findFirst({
      where: {
        token: sessionCookie.value,
        userId: decodedPayload.id,
        expiresAt: { gt: new Date() },
      },
    })
    if (!session) {
      console.warn("Session not found in DB or expired for token:", sessionCookie.value)
      const response = NextResponse.json({ error: "Invalid session: Session not found or expired" }, { status: 401 })
      response.cookies.set({ name: "qbit_session", value: "", maxAge: -1, path: "/" })
      return response
    }
    const userId = session.userId
    // --- END AUTH CHECK ---

    // Get the timeframe from the URL
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "7d"

    // Check if we have analytics data
    const analyticsCount = await prisma.analyticsData.count()

    // If no data exists, create some initial data
    if (analyticsCount === 0) {
      // Generate data for the last 90 days
      const startDateGen = new Date()
      startDateGen.setDate(startDateGen.getDate() - 90)

      for (let i = 0; i < 90; i++) {
        const date = new Date(startDateGen)
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
      return NextResponse.json({
        timeframe,
        security_score: 0,
        security_score_trend: "+0.0%",
        encryption_strength: 0,
        encryption_strength_trend: "+0.0%",
        threat_index: 0,
        threat_index_trend: "+0.0%",
        logs: [],
        chart_data: [], // Added chart_data for consistency
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
    // Filter by userId if it was successfully obtained
    const logWhereCondition: any = {
      timestamp: {
        gte: startDateRange,
        lte: endDateRange,
      },
    }
    if (userId !== null) {
      logWhereCondition.userId = userId
    }

    const logs = await prisma.securityLog.findMany({
      where: logWhereCondition,
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
      // Select required fields if not selecting all by default
      select: {
        timestamp: true,
        eventType: true,
        description: true,
        severity: true,
        // id: true, // Only if needed by formattedLogs
        // userId: true, // Only if needed by formattedLogs
      },
    })

    // Format logs for the response
    const formattedLogs = logs.map((log: Pick<SecurityLog, 'timestamp' | 'eventType' | 'description' | 'severity'>) => ({ // Use Pick<Type, keys>
      timestamp: `${new Date(log.timestamp).toISOString().split("T")[0]} ${new Date(log.timestamp).toTimeString().split(" ")[0]}`,
      eventType: log.eventType,
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
      chart_data: data.map((item: AnalyticsData) => ({ // Type item as AnalyticsData
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
