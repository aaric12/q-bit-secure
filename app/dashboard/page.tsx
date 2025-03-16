"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Activity,
  ArrowUpRight,
  Clock,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Lock,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  Timer,
  Wifi,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Overview } from "@/components/dashboard/overview-chart"
import { ActivityList } from "@/components/dashboard/activity-list"

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <div className="container px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Network Security Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring of your quantum-secured network</p>
          </div>
          <Button onClick={handleRefresh} className="shrink-0" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Status</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-500">Secure</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  +7% <ArrowUpRight className="ml-1 h-3 w-3" />
                </span>{" "}
                from last hour
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Transferred</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">1.2 TB</div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Key Exchange</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">2m ago</div>
              <p className="text-xs text-muted-foreground">Next exchange in 58 minutes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7 mt-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Network Overview</CardTitle>
              <CardDescription>Encryption performance over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Security Activity</CardTitle>
              <CardDescription>Recent network security events</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityList />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Full Activity Log
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Encryption Status</CardTitle>
              <CardDescription>Current encryption settings and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Encryption Method</span>
                    </div>
                    <span className="text-sm font-mono bg-muted rounded px-2 py-0.5">BB84 Quantum Protocol</span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Key Length</span>
                    </div>
                    <span className="text-sm font-mono bg-muted rounded px-2 py-0.5">256 bits</span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Key Refresh Rate</span>
                    </div>
                    <span className="text-sm font-mono bg-muted rounded px-2 py-0.5">3600 seconds</span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Encryption Strength</span>
                    <span className="text-green-500 font-medium">Excellent</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/configuration">
                  <Activity className="mr-2 h-4 w-4" />
                  Configure Encryption
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Health</CardTitle>
              <CardDescription>Critical network metrics and connectivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Connectivity</span>
                    </div>
                    <span className="text-sm text-green-500 font-medium">Optimal</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Latency</span>
                    <span className="font-mono">24ms</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Packet Loss</span>
                    <span className="font-mono">0.01%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Threat Detection</span>
                    <span className="text-green-500 font-medium">None Detected</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Health Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="link" asChild>
            <Link href="/analytics" className="inline-flex items-center">
              View Detailed Security Analytics
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

