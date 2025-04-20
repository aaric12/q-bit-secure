"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function IBMAnomalyDetector() {
  const [backendName, setBackendName] = useState("simulator")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runDetection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/security/anomalies/ibm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backend_name: backendName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to run IBM anomaly detection")
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
        <CardTitle>IBM Quantum Anomaly Detection</CardTitle>
        <CardDescription>Use IBM Quantum hardware to detect advanced quantum channel anomalies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">IBM Quantum Backend</label>
            <Select value={backendName} onValueChange={setBackendName}>
              <SelectTrigger>
                <SelectValue placeholder="Select a backend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simulator">Qiskit Simulator</SelectItem>
                <SelectItem value="ibmq_qasm_simulator">IBMQ QASM Simulator</SelectItem>
                <SelectItem value="ibmq_manila">IBM Manila</SelectItem>
                <SelectItem value="ibmq_quito">IBM Quito</SelectItem>
                <SelectItem value="ibmq_belem">IBM Belem</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={runDetection} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Detection...
              </>
            ) : (
              "Run IBM Quantum Analysis"
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
              <Alert variant={result.anomalies_detected ? "destructive" : "default"}>
                {result.anomalies_detected ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                <AlertTitle>{result.anomalies_detected ? "Anomalies Detected!" : "No Anomalies Detected"}</AlertTitle>
                <AlertDescription>
                  {result.anomalies_detected
                    ? `${result.anomalies.length} anomalies detected on ${result.backend}.`
                    : `The quantum channel on ${result.backend} appears secure.`}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Channel Quality:</span>
                  <span className="font-medium">{(result.overall_channel_quality * 100).toFixed(2)}%</span>
                </div>
                <Progress
                  value={result.overall_channel_quality * 100}
                  max={100}
                  className={
                    result.overall_channel_quality > 0.7
                      ? "bg-green-100"
                      : result.overall_channel_quality > 0.4
                        ? "bg-yellow-100"
                        : "bg-red-100"
                  }
                />
              </div>

              {result.anomalies_detected && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Detected Anomalies</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Affected Qubits</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.anomalies.map((anomaly: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {anomaly.type.charAt(0).toUpperCase() + anomaly.type.slice(1)}
                          </TableCell>
                          <TableCell>{anomaly.affected_qubits.join(", ")}</TableCell>
                          <TableCell>
                            <span
                              className={
                                anomaly.severity > 0.7
                                  ? "text-red-500"
                                  : anomaly.severity > 0.4
                                    ? "text-yellow-500"
                                    : "text-green-500"
                              }
                            >
                              {(anomaly.severity * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell>{anomaly.recommendation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
