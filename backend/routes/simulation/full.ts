import { NextResponse, NextRequest } from "next/server"
import prisma from "../../lib/db"
import { requireAuth } from "../../middleware/auth"

export async function runFullSimulation(request: NextRequest) {
  const user = await requireAuth(request)

  // Check if requireAuth returned an error response
  if (user instanceof NextResponse) {
    return user // Early return if not authenticated
  }

  try {
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

      // Store in the database
      await prisma.simulation.create({
        data: {
          userId: user.id,
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

    // Calculate QBER for BB84 (between 0.01 and 0.06) - This seems redundant as it's calculated above?
    // Consider if this qber value needs to be used/stored differently.
    const qber = 0.01 + Math.random() * 0.05

    // Calculate execution time (between 0.5 and 2.5 seconds) - Also seems redundant?
    const executionTime = 0.5 + Math.random() * 2

    // Store the quantum key in the database
    const expiresAt = new Date(Date.now() + 3600000) // Expires in 1 hour
    await prisma.quantumKey.create({
      data: {
        userId: user.id,
        keyData: simulationResults.BB84.key,
        protocol: "BB84",
        expiresAt: expiresAt,
      },
    })

    // Log the simulation
    await prisma.securityLog.create({
      data: {
        userId: user.id,
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
      qber, // Return the separately calculated qber
      execution_time: executionTime, // Return the separately calculated executionTime
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in full simulation API route:", error)

    // Fallback simulation data
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
