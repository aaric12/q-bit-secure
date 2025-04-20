import { NextResponse, NextRequest } from "next/server"
import prisma from "../../../../backend/lib/db" // Corrected import path
// No specific model types needed here as we are just creating
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
    const numQubits = data.numQubits || 100

    // Generate simulation results
    const protocols = ["BB84", "E91", "E92", "Six-State"]
    const simulationResults: Record<string, any> = {}

    for (const protocol of protocols) {
      // Generate a random key
      const keyLength = Math.floor(numQubits * (0.3 + Math.random() * 0.2))
      const key = Array(keyLength)
        .fill(0)
        .map(() => Math.round(Math.random()))
        .join("")

      // Calculate entropy (between 0.8 and 1.0)
      const entropy = 0.8 + Math.random() * 0.2

      // Store the results locally
      simulationResults[protocol] = {
        key,
        entropy,
        keyLength,
      }

      // Store in the database (Assuming model name simulationResult)
      await prisma.simulationResult.create({
        data: {
          userId: userId,
          protocol: protocol,
          numQubits: numQubits,
          keyGenerated: key,
          entropy: entropy,
          qber: protocol === "BB84" ? 0.01 + Math.random() * 0.05 : null,
          executionTime: 0.5 + Math.random() * 2,
          parameters: JSON.stringify({ algorithm: protocol, numQubits }),
        },
      })
    }

    // Calculate QBER for BB84 (between 0.01 and 0.06) - Redundant calculation?
    const qber = 0.01 + Math.random() * 0.05

    // Calculate execution time (between 0.5 and 2.5 seconds) - Redundant calculation?
    const executionTime = 0.5 + Math.random() * 2

    // Store the quantum key in the database (Assuming model name quantumKey)
    const expiresAt = new Date(Date.now() + 3600000) // Expires in 1 hour
    await prisma.quantumKey.create({
      data: {
        userId: userId,
        keyData: simulationResults.BB84.key,
        protocol: "BB84",
        expiresAt: expiresAt,
      },
    })

    // Log the simulation (Assuming model name securityLog)
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: "Simulation",
        description: `QKD simulation completed with ${numQubits} qubits`,
        severity: "Info",
      },
    })

    return NextResponse.json({
      keys: {
        BB84: simulationResults.BB84.key,
        E91: simulationResults.E91.key,
        E92: simulationResults.E92.key,
        "Six-State": simulationResults["Six-State"].key,
      },
      entropy: {
        BB84: simulationResults.BB84.entropy,
        E91: simulationResults.E91.entropy,
        E92: simulationResults.E92.entropy,
        "Six-State": simulationResults["Six-State"].entropy,
      },
      qber,
      execution_time: executionTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in full simulation API route:", error)
    // Fallback simulation data remains the same
    return NextResponse.json({
      keys: {
        BB84: "010110101001",
        E91: "10010110",
        E92: "11001010",
        "Six-State": "01101001",
      },
      entropy: {
        BB84: 0.9182,
        E91: 0.8791,
        E92: 0.9231,
        "Six-State": 0.8934,
      },
      qber: 0.0521,
      execution_time: 1.2345,
      timestamp: new Date().toISOString(),
      fallback: true,
    })
  }
}
