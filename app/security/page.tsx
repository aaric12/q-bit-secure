"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Loader2, Lock } from "lucide-react"

export default function SecurityPage() {
  const [loading, setLoading] = useState(false)
  const [numQubits, setNumQubits] = useState(5)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("eavesdropping")

  // Simulate running eavesdropping detection
  const runDetection = () => {
    setLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate random detection result
      const qber = Math.random() * 0.3 // Random QBER between 0 and 0.3
      const eavesdroppingDetected = qber > 0.15
      const confidence = eavesdroppingDetected ? Math.min(qber * 6.67, 1.0) : 0

      setDetectionResult({
        eavesdropping_detected: eavesdroppingDetected,
        qber: qber,
        confidence: confidence,
        eve_strategy: eavesdroppingDetected
          ? ["intercept-resend", "entanglement", "trojan"][Math.floor(Math.random() * 3)]
          : "None",
        affected_qubits: eavesdroppingDetected ? Math.floor(Math.random() * numQubits) + 1 : 0,
        timestamp: new Date().toISOString(),
      })

      setLoading(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Quantum Security</h1>
        <p className="text-muted-foreground mt-2">
          Monitor quantum channel security and detect potential eavesdropping attempts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="eavesdropping">Eavesdropping</TabsTrigger>
          <TabsTrigger value="ibm">IBM Quantum</TabsTrigger>
        </TabsList>

        <TabsContent value="eavesdropping" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Quantum Eavesdropping Detection</CardTitle>
              <CardDescription>Detect potential eavesdroppers using quantum key distribution protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Qubits: {numQubits}</label>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[numQubits]}
                    onValueChange={(value) => setNumQubits(value[0])}
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

                {detectionResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-4">
                    <Alert variant={detectionResult.eavesdropping_detected ? "destructive" : "default"}>
                      {detectionResult.eavesdropping_detected ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <AlertTitle>
                        {detectionResult.eavesdropping_detected
                          ? "Eavesdropping Detected!"
                          : "No Eavesdropping Detected"}
                      </AlertTitle>
                      <AlertDescription>
                        {detectionResult.eavesdropping_detected
                          ? `Potential ${detectionResult.eve_strategy} attack detected with ${Math.round(detectionResult.confidence * 100)}% confidence.`
                          : "The quantum channel appears secure."}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>QBER (Quantum Bit Error Rate):</span>
                        <span className="font-medium">{(detectionResult.qber * 100).toFixed(2)}%</span>
                      </div>
                      <Progress value={detectionResult.qber * 100} max={100} />
                    </div>

                    {detectionResult.eavesdropping_detected && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Detection Confidence:</span>
                          <span className="font-medium">{(detectionResult.confidence * 100).toFixed(2)}%</span>
                        </div>
                        <Progress value={detectionResult.confidence * 100} max={100} />
                      </div>
                    )}

                    {detectionResult.eavesdropping_detected && (
                      <div>
                        <h4 className="font-medium mb-2">Affected Qubits: {detectionResult.affected_qubits}</h4>
                        <p className="text-sm text-muted-foreground">
                          {detectionResult.eve_strategy === "intercept-resend"
                            ? "Intercept-resend attacks measure qubits and resend new ones, causing detectable errors."
                            : detectionResult.eve_strategy === "entanglement"
                              ? "Entanglement-based attacks create correlations that can be detected through statistical analysis."
                              : "Trojan horse attacks inject signals into the quantum channel to extract information."}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ibm" className="space-y-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>IBM Quantum Anomaly Detection</CardTitle>
              <CardDescription>Use IBM Quantum hardware to detect advanced quantum channel anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">IBM Quantum Backend</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="simulator">Qiskit Simulator</option>
                      <option value="ibmq_qasm_simulator">IBMQ QASM Simulator</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <Button className="w-full h-full">Run IBM Quantum Analysis</Button>
                  </div>
                </div>

                <div className="bg-muted p-6 rounded-lg text-center">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">IBM Quantum Integration</h3>
                  <p className="text-muted-foreground">
                    Connect your IBM Quantum account to run advanced quantum security analysis on real quantum hardware.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Connect IBM Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component for the Shield Alert icon
function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
