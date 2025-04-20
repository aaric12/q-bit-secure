"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react"

export default function EavesdroppingDetector() {
  const [numQubits, setNumQubits] = useState(5)
  const [numBits, setNumBits] = useState(100)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDetection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/security/eavesdropping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          num_qubits: numQubits,
          num_bits: numBits,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to run eavesdropping detection")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("An error occurred while running the detection")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quantum Eavesdropping Detection</CardTitle>
        <CardDescription>Detect potential eavesdroppers using quantum key distribution protocols</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="num-qubits">Number of Qubits: {numQubits}</Label>
            <Slider
              id="num-qubits"
              min={1}
              max={10}
              step={1}
              value={[numQubits]}
              onValueChange={(value) => setNumQubits(value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num-bits">Number of Bits: {numBits}</Label>
            <Slider
              id="num-bits"
              min={10}
              max={500}
              step={10}
              value={[numBits]}
              onValueChange={(value) => setNumBits(value[0])}
            />
          </div>

          <Button onClick={runDetection} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Detection...
              </>
            ) : (
              "Run Eavesdropping Detection"
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-4 mt-4">
              <Alert variant={result.eavesdropping_detected ? "destructive" : "default"}>
                {result.eavesdropping_detected ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                <AlertTitle>
                  {result.eavesdropping_detected ? "Eavesdropping Detected!" : "No Eavesdropping Detected"}
                </AlertTitle>
                <AlertDescription>
                  {result.eavesdropping_detected
                    ? `Potential ${result.eve_strategy} attack detected with ${Math.round(result.confidence * 100)}% confidence.`
                    : "The quantum channel appears secure."}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>QBER (Quantum Bit Error Rate):</span>
                  <span className="font-medium">{(result.qber * 100).toFixed(2)}%</span>
                </div>
                <Progress value={result.qber * 100} max={100} />
              </div>

              {result.eavesdropping_detected && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Detection Confidence:</span>
                    <span className="font-medium">{(result.confidence * 100).toFixed(2)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} max={100} />
                </div>
              )}

              {result.eavesdropping_detected && (
                <div>
                  <h4 className="font-medium mb-2">Affected Qubits: {result.affected_qubits}</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.eve_strategy === "intercept-resend"
                      ? "Intercept-resend attacks measure qubits and resend new ones, causing detectable errors."
                      : result.eve_strategy === "entanglement"
                        ? "Entanglement-based attacks create correlations that can be detected through statistical analysis."
                        : "Trojan horse attacks inject signals into the quantum channel to extract information."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
