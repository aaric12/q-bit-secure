"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
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
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Overview } from "@/components/dashboard/overview-chart"
import { ActivityList } from "@/components/dashboard/activity-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard/summary")

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err)
      setError(`Failed to load dashboard data: ${err.message}`)
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAuthLoading]);

  if (isAuthLoading || (isAuthenticated && loading)) {
    return (
      <div className="container px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium">Loading Dashboard...</h3>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="container px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchDashboardData} className="mt-4" disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Retry
        </Button>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="container px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium">Initializing dashboard...</h3>
        </div>
      </div>
    );
  }

  const data = dashboardData;

  return (
    <div className="container px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Network Security Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring of your quantum-secured network</p>
          </div>
          <Button onClick={fetchDashboardData} className="shrink-0" disabled={refreshing}>
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
              <div className="text-xl font-bold text-green-500">{data.network_status}</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{data.active_connections?.toLocaleString() ?? 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 inline-flex items-center">
                  +{data.active_connections_change ?? 0}% <ArrowUpRight className="ml-1 h-3 w-3" />
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
              <div className="text-xl font-bold">{data.data_transferred}</div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Key Exchange</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{data.last_key_exchange}</div>
              <p className="text-xs text-muted-foreground">Next exchange in {data.next_key_exchange}</p>
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
              <ActivityList items={data.recent_activity ?? []} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/activity-log">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Activity Log
                </Link>
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
                    <span className="text-sm font-mono bg-muted rounded px-2 py-0.5">{data.encryption_method}</span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Key Length</span>
                    </div>
                    <span className="text-sm font-mono bg-muted rounded px-2 py-0.5">{data.key_length} bits</span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Key Refresh Rate</span>
                    </div>
                    <span className="text-sm font-mono bg-muted rounded px-2 py-0.5">
                      {data.key_refresh_rate} seconds
                    </span>
                  </div>
                  <Separator />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Encryption Strength</span>
                    <span className="text-green-500 font-medium">Excellent</span>
                  </div>
                  <Progress value={data.encryption_strength} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Performance</CardTitle>
              <CardDescription>Connectivity and threat detection metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Connectivity</span>
                    <span className="font-medium text-green-500">{data.connectivity}</span>
                  </div>
                  <Progress value={data.connectivity_score} className="h-2" />
                  <p className="text-xs text-muted-foreground">Score: {data.connectivity_score}/100</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Latency</span>
                    <span className="font-medium">{data.latency}</span>
                  </div>
                  <Progress value={data.latency_score} className="h-2" />
                  <p className="text-xs text-muted-foreground">Score: {data.latency_score}/100</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Packet Loss</span>
                    <span className="font-medium text-green-500">{data.packet_loss}</span>
                  </div>
                  <Progress value={data.packet_loss_score} className="h-2" />
                  <p className="text-xs text-muted-foreground">Score: {data.packet_loss_score}/100</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Threat Detection</span>
                    <span className="font-medium text-green-500">{data.threat_detection}</span>
                  </div>
                  <Progress value={data.threat_detection_score} className="h-2" />
                  <p className="text-xs text-muted-foreground">Score: {data.threat_detection_score}/100</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <Wifi className="mr-2 h-4 w-4" />
                Run Diagnostics
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/security/alerts">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Security Alerts
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
