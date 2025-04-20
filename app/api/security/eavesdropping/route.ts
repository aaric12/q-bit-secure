import { NextResponse, NextRequest } from "next/server"
import prisma from "../../../../backend/lib/db" // Corrected import path
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"

export async function POST(request: NextRequest) {
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

    const data = await request.json()
    const numQubits = data.num_qubits || 5 // Keep snake_case for incoming JSON payload
    const numBits = data.num_bits || 100   // Keep snake_case for incoming JSON payload

    // Generate a random QBER (Quantum Bit Error Rate)
    const qber = Math.random() * 0.3

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
        userId: userId,
        eventType: "Security",
        description:
          eavesdroppingDetected
            ? `Potential eavesdropping detected with ${(confidence * 100).toFixed(0)}% confidence`
            : "Eavesdropping detection completed, no threats found",
        severity: eavesdroppingDetected ? "Alert" : "Info",
        metadata: JSON.stringify({
          qber,
          confidence,
          eveStrategy: eveStrategy,
          affectedQubits: affectedQubits,
          numQubits: numQubits,
          numBits: numBits,
        }),
      },
    })

    return NextResponse.json({
      eavesdropping_detected: eavesdroppingDetected, // Keep snake_case for response payload
      qber,
      confidence,
      eve_strategy: eveStrategy, // Keep snake_case for response payload
      affected_qubits: affectedQubits, // Keep snake_case for response payload
      error_rates: errorRates, // Keep snake_case for response payload
      plots: [],
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
