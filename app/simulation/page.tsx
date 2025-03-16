"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, DownloadCloud, LockKeyhole, RotateCw, Send, Shield, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SimulationPage() {
  const [simulationActive, setSimulationActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const [keyGenerated, setKeyGenerated] = useState(false)
  const [simulationLog, setSimulationLog] = useState<string[]>([])

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
          }

          return newProgress
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [simulationActive, progress])

  const startSimulation = () => {
    setSimulationActive(true)
    setProgress(0)
    setStep(0)
    setKeyGenerated(false)
    setSimulationLog(["Starting QKD simulation..."])
  }

  const resetSimulation = () => {
    setSimulationActive(false)
    setProgress(0)
    setStep(0)
    setKeyGenerated(false)
    setSimulationLog([])
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Quantum Key Distribution Simulation</h1>
        <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          This interactive simulation demonstrates the BB84 protocol for quantum key distribution, showing how quantum
          principles enable secure key exchange.
        </p>

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

                <div className="mt-6 flex justify-center space-x-4">
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
                          <span className="text-sm font-mono">{keyGenerated ? "512 qubits" : "—"}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Matching Basis Measurements</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3">
                          <span className="text-sm font-mono">{keyGenerated ? "248 bits" : "—"}</span>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Final Key Length</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3">
                          <span className="text-sm font-mono">{keyGenerated ? "128 bits" : "—"}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Preview</h4>
                        <div className="h-8 bg-muted rounded flex items-center px-3 overflow-hidden">
                          <span className="text-sm font-mono truncate">
                            {keyGenerated ? "0xF7A3B291E45D8C0E7124A6D9E..." : "—"}
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
      </motion.div>
    </div>
  )
}

