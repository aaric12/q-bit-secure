import { NextResponse, NextRequest } from "next/server"
import prisma from "../../lib/db"
import { requireAuth } from "../../middleware/auth"

export async function getAnomalyTimeline(request: NextRequest) {
  const user = await requireAuth(request)

  // Check if requireAuth returned an error response
  if (user instanceof NextResponse) {
    return user // Early return if not authenticated
  }

  try {
    // Generate anomaly data for the last 30 days
    const now = new Date()
    const anomalies = []

    for (let i = 0; i < 30; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const qber = Math.random() * 0.3
      const isAnomaly = qber > 0.15 || (i % 7 === 0 && Math.random() > 0.7)

      anomalies.push({
        date: date.toISOString().split("T")[0],
        qber,
        is_anomaly: isAnomaly,
        confidence: Math.min(qber * 6.67, 1.0),
        affected_qubits: isAnomaly ? Math.floor(Math.random() * 5) + 1 : 0,
        protocol: ["BB84", "E91", "Six-State"][Math.floor(Math.random() * 3)],
        severity: qber > 0.25 ? "High" : qber > 0.15 ? "Medium" : "Low",
      })
    }

    // Log the anomaly check
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: "Security",
        description: "Anomaly timeline requested",
        severity: "Info",
      },
    })

    return NextResponse.json({
      anomalies,
      total_anomalies: anomalies.filter((a) => a.is_anomaly).length,
      average_qber: anomalies.reduce((sum, a) => sum + a.qber, 0) / anomalies.length,
      last_updated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in anomaly timeline API route:", error)

    // Generate fallback data
    const now = new Date()
    const anomalies = Array(30)
      .fill(0)
      .map((_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const qber = Math.random() * 0.3
        const isAnomaly = qber > 0.15 || (i % 7 === 0 && Math.random() > 0.7)

        return {
          date: date.toISOString().split("T")[0],
          qber,
          is_anomaly: isAnomaly,
          confidence: Math.min(qber * 6.67, 1.0),
          affected_qubits: isAnomaly ? Math.floor(Math.random() * 5) + 1 : 0,
          protocol: ["BB84", "E91", "Six-State"][Math.floor(Math.random() * 3)],
          severity: qber > 0.25 ? "High" : qber > 0.15 ? "Medium" : "Low",
        }
      })

    return NextResponse.json({
      anomalies,
      total_anomalies: anomalies.filter((a) => a.is_anomaly).length,
      average_qber: anomalies.reduce((sum, a) => sum + a.qber, 0) / anomalies.length,
      last_updated: new Date().toISOString(),
      fallback: true,
    })
  }
}
