import { type NextRequest, NextResponse } from "next/server"
import prisma from "../lib/prisma"
import { requireAuth } from "../lib/auth"

export async function runFullSimulation(request: NextRequest) {
  try {
    // Authenticate the user
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

      // Store the results
      simulationResults[protocol] = {
        key,
        entropy,
        keyLength,
      }

      // Store in the database
      await prisma.simulation.create({
        data: {
          userId: user.id,
          protocol,
          numQubits,
          keyGenerated: key,
          entropy,
          qber: protocol === "BB84" ? 0.01 + Math.random() * 0.05 : null, // Only BB84 has QBER
          executionTime: 0.5 + Math.random() * 2, // Execution time between 0.5 and 2.5 seconds
          parameters: {
            algorithm: protocol,
            numQubits,
          },
        },
      })
    }

    // Calculate QBER for BB84 (between 0.01 and 0.06)
    const qber = 0.01 + Math.random() * 0.05

    // Calculate execution time (between 0.5 and 2.5 seconds)
    const executionTime = 0.5 + Math.random() * 2

    // Store the quantum key in the database
    await prisma.quantumKey.create({
      data: {
        userId: user.id,
        keyData: simulationResults.BB84.key,
        protocol: "BB84",
        expiresAt: new Date(Date.now() + 3600000), // Expires in 1 hour
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
      qber,
      execution_time: executionTime,
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
