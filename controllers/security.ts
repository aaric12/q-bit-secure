import { type NextRequest, NextResponse } from "next/server"
import prisma from "../lib/prisma"
import { requireAuth } from "../lib/auth"

export async function detectEavesdropping(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const numQubits = data.num_qubits || 5
    const numBits = data.num_bits || 100

    // Generate a random QBER (Quantum Bit Error Rate)
    const qber = Math.random() * 0.3 // Random QBER between 0 and 0.3

    // Determine if eavesdropping is detected based on QBER
    const eavesdroppingDetected = qber > 0.15

    // Calculate confidence level
    const confidence = eavesdroppingDetected ? Math.min(qber * 6.67, 1.0) : 0

    // Determine the eavesdropping strategy if detected
    const eveStrategy = eavesdroppingDetected
      ? ["intercept-resend", "entanglement", "trojan"][Math.floor(Math.random() * 3)]
      : "None"

    // Calculate the number of affected qubits
    const affectedQubits = eavesdroppingDetected ? Math.floor(Math.random() * numQubits) + 1 : 0

    // Generate random error rates for visualization
    const errorRates = Array(5)
      .fill(0)
      .map(() => Math.random() * 0.3)

    // Log the eavesdropping detection
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: "Security",
        description: eavesdroppingDetected
          ? `Potential eavesdropping detected with ${(confidence * 100).toFixed(0)}% confidence`
          : "Eavesdropping detection completed, no threats found",
        severity: eavesdroppingDetected ? "Alert" : "Info",
        metadata: {
          qber,
          confidence,
          eve_strategy: eveStrategy,
          affected_qubits: affectedQubits,
          num_qubits: numQubits,
          num_bits: numBits,
        },
      },
    })

    return NextResponse.json({
      eavesdropping_detected: eavesdroppingDetected,
      qber,
      confidence,
      eve_strategy: eveStrategy,
      affected_qubits: affectedQubits,
      error_rates: errorRates,
      plots: [], // No plots in this simplified version
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in eavesdropping detection API route:", error)

    // Fallback data
    return NextResponse.json({
      eavesdropping_detected: Math.random() > 0.7,
      qber: Math.random() * 0.3,
      confidence: Math.random(),
      eve_strategy: ["None", "intercept-resend", "entanglement"][Math.floor(Math.random() * 3)],
      affected_qubits: Math.floor(Math.random() * 5),
      error_rates: Array(5)
        .fill(0)
        .map(() => Math.random() * 0.3),
      plots: [],
      timestamp: new Date().toISOString(),
      fallback: true,
    })
  }
}

export async function getAnomalyTimeline(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
