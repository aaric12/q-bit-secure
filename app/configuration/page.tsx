"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Save, ArrowLeft, Timer, ShieldAlert, Lock, KeyRound, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function ConfigurationPage() {
  const [encryptionMethod, setEncryptionMethod] = useState("bb84")
  const [keyLength, setKeyLength] = useState(256)
  const [refreshRate, setRefreshRate] = useState(3600)
  const [enhancedSecurity, setEnhancedSecurity] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)

  const handleSaveChanges = () => {
    toast({
      title: "Configuration Updated",
      description: "Your encryption settings have been saved successfully.",
    })
  }

  return (
    <div className="container px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          <div>
            <Button variant="outline" size="sm" asChild className="mb-2">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Quantum Encryption Configuration</h1>
            <p className="text-muted-foreground">Configure your quantum-safe encryption settings</p>
          </div>
        </div>

        <Tabs defaultValue="encryption" className="space-y-4">
          <TabsList>
            <TabsTrigger value="encryption">Encryption Settings</TabsTrigger>
            <TabsTrigger value="network">Network Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>

          <TabsContent value="encryption" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  Encryption Method
                </CardTitle>
                <CardDescription>Select the quantum encryption protocol to use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select value={encryptionMethod} onValueChange={setEncryptionMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select encryption method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bb84">BB84 Protocol</SelectItem>
                    <SelectItem value="e91">E91 Protocol</SelectItem>
                    <SelectItem value="b92">B92 Protocol</SelectItem>
                    <SelectItem value="six-state">Six-State Protocol</SelectItem>
                  </SelectContent>
                </Select>

                <div className="mt-4 rounded-md bg-muted p-4">
                  <h4 className="font-medium mb-2">Protocol Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {encryptionMethod === "bb84" &&
                      "BB84 is the first quantum key distribution protocol developed by Bennett and Brassard. It's robust against eavesdropping and uses single photon polarization."}
                    {encryptionMethod === "e91" &&
                      "E91 is based on quantum entanglement and Bell's inequality. It provides excellent security against sophisticated attacks."}
                    {encryptionMethod === "b92" &&
                      "B92 is a simplified version of BB84 that uses only two quantum states. It's more efficient but offers slightly less security than BB84."}
                    {encryptionMethod === "six-state" &&
                      "The Six-State Protocol is an extension of BB84 that uses six states instead of four, providing better error detection and improved security margins."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <KeyRound className="mr-2 h-5 w-5 text-primary" />
                  Key Configuration
                </CardTitle>
                <CardDescription>Configure the properties of your encryption keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Key Length (bits)</Label>
                      <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{keyLength}</span>
                    </div>
                    <Slider
                      value={[keyLength]}
                      min={128}
                      max={512}
                      step={128}
                      onValueChange={(values) => setKeyLength(values[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Longer keys provide better security but may impact performance slightly.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Key Refresh Rate (seconds)</Label>
                      <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded">{refreshRate}</span>
                    </div>
                    <Slider
                      value={[refreshRate]}
                      min={300}
                      max={7200}
                      step={300}
                      onValueChange={(values) => setRefreshRate(values[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      How frequently new keys are generated. More frequent refreshes improve security but increase
                      overhead.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlert className="mr-2 h-5 w-5 text-primary" />
                  Enhanced Security Features
                </CardTitle>
                <CardDescription>Configure additional security measures for your network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Switch id="enhanced-security" checked={enhancedSecurity} onCheckedChange={setEnhancedSecurity} />
                    <div className="space-y-1">
                      <Label htmlFor="enhanced-security" className="text-base font-medium cursor-pointer">
                        Quantum-Resistant Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable post-quantum cryptographic algorithms for authentication alongside QKD key exchange.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Switch id="intrusion-detection" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="intrusion-detection" className="text-base font-medium cursor-pointer">
                        Quantum Intrusion Detection
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Monitor for quantum-based eavesdropping attempts and terminate compromised connections.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Switch id="perfect-forward-secrecy" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="perfect-forward-secrecy" className="text-base font-medium cursor-pointer">
                        Perfect Forward Secrecy
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Generate unique session keys to ensure past communications remain secure even if a key is
                        compromised.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="mr-2 h-5 w-5 text-primary" />
                  Connection Settings
                </CardTitle>
                <CardDescription>Configure your quantum network connection parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Connection Timeout</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeout value" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                          <SelectItem value="120">120 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Retry Attempts</Label>
                      <Select defaultValue="3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select max retries" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                          <SelectItem value="10">10 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Switch id="auto-reconnect" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="auto-reconnect" className="text-base font-medium cursor-pointer">
                        Auto Reconnect
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically attempt to reestablish quantum connection if interrupted.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5 text-primary" />
                  Update Settings
                </CardTitle>
                <CardDescription>Configure how your quantum security software is updated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Switch id="auto-update" checked={autoUpdate} onCheckedChange={setAutoUpdate} />
                    <div className="space-y-1">
                      <Label htmlFor="auto-update" className="text-base font-medium cursor-pointer">
                        Automatic Updates
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Install security updates automatically when they become available.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Update Channel</Label>
                    <Select defaultValue="stable">
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="beta">Beta</SelectItem>
                        <SelectItem value="dev">Development</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Stable is recommended for production environments.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Update Time</Label>
                    <Select defaultValue="night">
                      <SelectTrigger>
                        <SelectValue placeholder="Select update time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately</SelectItem>
                        <SelectItem value="night">Overnight (2-4 AM)</SelectItem>
                        <SelectItem value="weekend">Weekends Only</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logging & Diagnostics</CardTitle>
                <CardDescription>Configure how system events are logged and monitored</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Log Level</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue placeholder="Select log level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error Only</SelectItem>
                        <SelectItem value="warn">Warning & Error</SelectItem>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="debug">Debug (Verbose)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Higher verbosity levels may impact performance.</p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Switch id="remote-diagnostics" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="remote-diagnostics" className="text-base font-medium cursor-pointer">
                        Remote Diagnostics
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow secure remote diagnostics to assist with troubleshooting (encryption performance only, no
                        data content).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Switch id="health-alerts" defaultChecked />
                    <div className="space-y-1">
                      <Label htmlFor="health-alerts" className="text-base font-medium cursor-pointer">
                        Health Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when system health or security issues are detected.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveChanges} className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
