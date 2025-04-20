import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const ibmToken = request.headers.get("X-IBM-Token")

    const response = await fetch(`${process.env.PYTHON_API_URL}/api/security/anomalies/ibm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-IBM-Token": ibmToken || "",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in IBM anomaly detection API route:", error)

    // Fallback data
    const anomalyTypes = ["bit-flip", "phase-flip", "depolarizing", "amplitude-damping"]
    const detectedAnomalies = []

    const numAnomalies = Math.floor(Math.random() * 4)
    for (let i = 0; i < numAnomalies; i++) {
      const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
      const affectedQubits = Array(Math.floor(Math.random() * 3) + 1)
        .fill(0)
        .map(() => Math.floor(Math.random() * 5))
      const severity = Math.random() * 0.8 + 0.1

      detectedAnomalies.push({
        type: anomalyType,
        affected_qubits: affectedQubits,
        severity,
        description: `${anomalyType.charAt(0).toUpperCase() + anomalyType.slice(1)} noise detected on qubit(s) ${affectedQubits.join(", ")}`,
        recommendation: severity < 0.5 ? "Adjust error correction parameters" : "Switch to a different quantum channel",
      })
    }

    return NextResponse.json({
      backend: data.backend_name || "simulator",
      anomalies_detected: detectedAnomalies.length > 0,
      anomalies: detectedAnomalies,
      overall_channel_quality: Math.random() * 0.5 + 0.5,
      timestamp: new Date().toISOString(),
      fallback: true,
    })
  }
}
