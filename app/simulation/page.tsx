"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  DownloadCloud,
  LockKeyhole,
  RotateCw,
  Send,
  Shield,
  Wand2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function SimulationPage() {
  const [simulationActive, setSimulationActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const [keyGenerated, setKeyGenerated] = useState(false)
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  const [numQubits, setNumQubits] = useState(100)
  const [simulationResults, setSimulationResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    "Initializing quantum states...",
    "Encoding random bits in photons...",
    "Transmitting photons through quantum channel...",
    "Measuring photons in random bases...",
    "Comparing measurement bases...",
    "Performing error correction...",
    "Privacy amplification in progress...",
    "Generating final secure key...",
    "Encryption key established!",
  ]

  const addLogMessage = (message: string) => {
    setSimulationLog((prev) => [...prev, message])
  }

  useEffect(() => {
    if (simulationActive && progress < 100) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1

          // Update steps based on progress
          if (newProgress === 10) {
            setStep(1)
            addLogMessage("Quantum state preparation complete")
          } else if (newProgress === 25) {
            setStep(2)
            addLogMessage("Random bits encoded successfully")
          } else if (newProgress === 40) {
            setStep(3)
            addLogMessage("Photon transmission in progress")
          } else if (newProgress === 55) {
            setStep(4)
            addLogMessage("Measurement complete: 512 qubits processed")
          } else if (newProgress === 70) {
            setStep(5)
            addLogMessage("Bases compared: 248 matching measurements")
          } else if (newProgress === 80) {
            setStep(6)
            addLogMessage("Error rate: 2.4% (below threshold)")
          } else if (newProgress === 90) {
            setStep(7)
            addLogMessage("Privacy amplification reduced key to 128 bits")
          } else if (newProgress >= 100) {
            setStep(8)
            addLogMessage("Secure key established!")
            setKeyGenerated(true)
            clearInterval(interval)

            // Run the actual simulation API call
            runSimulationAPI()
          }

          return newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [simulationActive, progress])

  const startSimulation = () => {
    setSimulationActive(true)
    setProgress(0)
    setStep(0)
    setKeyGenerated(false)
    setSimulationLog(["Starting QKD simulation..."])
    setSimulationResults(null)
    setError(null)
  }

  const resetSimulation = () => {
    setSimulationActive(false)
    setProgress(0)
    setStep(0)
    setKeyGenerated(false)
    setSimulationLog([])
    setSimulationResults(null)
    setError(null)
  }

  const runSimulationAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/simulation/full", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numQubits,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to run simulation")
      }

      const data = await response.json()
      setSimulationResults(data)
      addLogMessage(`Simulation completed in ${data.execution_time.toFixed(2)}s`)
    } catch (err) {
      console.error("Simulation error:", err)
      setError("An error occurred during the simulation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format entropy data for chart
  const formatEntropyData = () => {
    if (!simulationResults || !simulationResults.entropy) return []

    return Object.entries(simulationResults.entropy).map(([protocol, value]) => ({
      protocol,
      entropy: Number.parseFloat(value as string),
    }))
  }

  // Get QBER severity
  const getQberSeverity = (qber: number) => {
    if (qber < 0.05) return "success"
    if (qber < 0.15) return "warning"
    return "error"
  }

  // Truncate key for display
  const truncateKey = (key: string, maxLength = 20) => {
    if (key.length <= maxLength) return key
    return `${key.substring(0, maxLength)}...`
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Quantum Key Distribution Simulation</h1>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          This interactive simulation demonstrates quantum key distribution protocols, showing how quantum principles
          enable secure key exchange.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 h-5 w-5 text-primary" />
                  Quantum Channel Visualization
                </CardTitle>
                <CardDescription>Real-time visualization of quantum key exchange</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[400px] border rounded-md p-4 bg-black/5 dark:bg-white/5">
                  <div className="flex justify-between items-center mb-10">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-lg border bg-background flex items-center justify-center mx-auto mb-2">
                        <LockKeyhole className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-semibold">Alice</p>
                      <p className="text-xs text-muted-foreground">Sender</p>
                    </div>

                    <div className="flex-1 relative h-2 mx-8">
                      <div className="absolute inset-0 border-t border-dashed border-muted-foreground/50 top-1/2"></div>

                      {simulationActive && progress > 10 && progress < 90 && (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"
                              initial={{ left: "0%" }}
                              animate={{ left: "100%" }}
                              transition={{
                                duration: 2,
                                delay: i * 0.7,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "loop",
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="h-16 w-16 rounded-lg border bg-background flex items-center justify-center mx-auto mb-2">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-semibold">Bob</p>
                      <p className="text-xs text-muted-foreground">Receiver</p>
                    </div>
                  </div>

                  <div className="mb-8 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress:</span>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="text-center p-4 bg-background rounded-md">
                    <p className="font-medium">{steps[step]}</p>
                  </div>

                  {keyGenerated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-md shadow-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <LockKeyhole className="h-5 w-5" />
                        <span className="font-bold">Secure Key Established!</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Qubits: {numQubits}</label>
                    <Slider
                      min={10}
                      max={500}
                      step={10}
                      value={[numQubits]}
                      onValueChange={(value) => setNumQubits(value[0])}
                      disabled={simulationActive}
                    />
                  </div>

                  <div className="flex justify-center space-x-4">
                    {!simulationActive ? (
                      <Button onClick={startSimulation} className="w-40">
                        <Send className="mr-2 h-4 w-4" />
                        Start Simulation
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={resetSimulation} className="w-40">
                        <RotateCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Simulation Data
                </CardTitle>
                <CardDescription>Live protocol execution details</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="log">
                  <TabsList className="w-full">
                    <TabsTrigger value="log" className="flex-1">
                      Log
                    </TabsTrigger>
                    <TabsTrigger value="key" className="flex-1">
                      Key Data
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="log" className="space-y-4 mt-4">
                    <div className="h-[320px] overflow-y-auto border rounded-md p-3 text-sm font-mono">
                      {simulationLog.length > 0 ? (
                        simulationLog.map((log, index) => (
                          <div key={index} className="pb-1">
                            <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground italic">
                          Start the simulation to see the protocol execution log...
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="key" className="space-y-4 mt-4">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Raw Qubits Exchanged</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3">
                          <span className="text-sm font-mono">{keyGenerated ? `${numQubits} qubits` : "—"}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Matching Basis Measurements</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3">
                          <span className="text-sm font-mono">
                            {keyGenerated ? `${Math.floor(numQubits * 0.48)} bits` : "—"}
                          </span>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Final Key Length</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3">
                          <span className="text-sm font-mono">
                            {keyGenerated && simulationResults ? `${simulationResults.keys.BB84.length} bits` : "—"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Preview</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3 overflow-hidden">
                          <span className="text-sm font-mono truncate">
                            {keyGenerated && simulationResults ? truncateKey(simulationResults.keys.BB84, 30) : "—"}
                          </span>
                        </div>
                      </div>
                      {keyGenerated && (
                        <Button variant="outline" className="w-full">
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          Save Key Data
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Simulation Results</CardTitle>
                <CardDescription>Analysis of quantum key distribution protocols</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Protocol Comparison</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={formatEntropyData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="protocol" />
                          <YAxis
                            label={{
                              value: "Entropy (bits)",
                              angle: -90,
                              position: "insideLeft",
                              style: { textAnchor: "middle" },
                            }}
                            domain={[0, 1]}
                          />
                          <RechartsTooltip formatter={(value) => [`${value.toFixed(4)} bits`, "Entropy"]} />
                          <Legend />
                          <Bar dataKey="entropy" name="Entropy" fill="#8884d8" animationDuration={1000} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">BB84 QBER Analysis</h3>
                    <div className="space-y-4">
                      <Alert variant={getQberSeverity(simulationResults.qber)}>
                        {simulationResults.qber < 0.05 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        <AlertTitle>
                          {simulationResults.qber < 0.05
                            ? "Secure Channel"
                            : simulationResults.qber < 0.15
                              ? "Potential Eavesdropping"
                              : "Likely Eavesdropping"}
                        </AlertTitle>
                        <AlertDescription>
                          QBER: {(simulationResults.qber * 100).toFixed(2)}%
                          {simulationResults.qber < 0.05
                            ? " - The quantum channel appears secure."
                            : " - Elevated error rate detected. Possible eavesdropping or channel noise."}
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Quantum Bit Error Rate:</span>
                          <span className="font-medium">{(simulationResults.qber * 100).toFixed(2)}%</span>
                        </div>
                        <Progress
                          value={simulationResults.qber * 100}
                          max={30}
                          className={
                            simulationResults.qber < 0.05
                              ? "bg-green-100"
                              : simulationResults.qber < 0.15
                                ? "bg-yellow-100"
                                : "bg-red-100"
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="border rounded-md p-3">
                          <h4 className="text-sm font-medium mb-1">Execution Time</h4>
                          <p className="text-lg font-mono">{simulationResults.execution_time.toFixed(2)}s</p>
                        </div>
                        <div className="border rounded-md p-3">
                          <h4 className="text-sm font-medium mb-1">Timestamp</h4>
                          <p className="text-sm font-mono">
                            {new Date(simulationResults.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Generated Keys</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(simulationResults.keys).map(([protocol, key]) => (
                      <div key={protocol} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{protocol}</h4>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">{(key as string).length} bits</span>
                        </div>
                        <div className="bg-muted p-2 rounded-md font-mono text-xs overflow-hidden">
                          {truncateKey(key as string, 40)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
