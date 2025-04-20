import { NextResponse, NextRequest } from "next/server"
import prisma from "../../lib/db"
import { requireAuth } from "../../middleware/auth"

export async function detectEavesdropping(request: NextRequest) {
  const user = await requireAuth(request)

  // Check if requireAuth returned an error response
  if (user instanceof NextResponse) {
    return user // Early return if not authenticated
  }

  try {
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
        description:
          eavesdroppingDetected
            ? `Potential eavesdropping detected with ${(confidence * 100).toFixed(0)}% confidence`
            : "Eavesdropping detection completed, no threats found",
        severity: eavesdroppingDetected ? "Alert" : "Info",
        metadata: JSON.stringify({
          qber,
          confidence,
          eveStrategy: eveStrategy, // Use camelCase for metadata keys if desired, though JSON is flexible
          affectedQubits: affectedQubits,
          numQubits: numQubits, // Corrected from num_qubits if needed
          numBits: numBits, // Corrected from num_bits if needed
        }),
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
