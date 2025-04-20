"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Download,
  BarChart3,
  LineChart,
  PieChart,
  Shield,
  AlertTriangle,
  FileBarChartIcon as FileBar,
  RefreshCw,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EncryptionPerformanceChart } from "@/components/analytics/encryption-performance-chart"
import { ThreatDetectionChart } from "@/components/analytics/threat-detection-chart"
import { EncryptionDistributionChart } from "@/components/analytics/encryption-distribution-chart"
import { SecurityScoreCard } from "@/components/analytics/security-score-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("7d")
  const [refreshing, setRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = async () => {
    setRefreshing(true)
    setError(null)

    try {
      const response = await fetch(`/api/analytics/summary?timeframe=${timeframe}`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const data = await response.json()
      setAnalyticsData(data)
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setRefreshing(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeframe])

  if (loading) {
    return (
      <div className="container px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium">Loading analytics data...</h3>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchAnalyticsData} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  // If no data is available yet, use fallback data
  const data = analyticsData || {
    security_score: 94,
    security_score_trend: "+2%",
    encryption_strength: 98,
    encryption_strength_trend: "0%",
    threat_index: 3,
    threat_index_trend: "-1%",
    logs: Array(20)
      .fill(null)
      .map((_, i) => ({
        timestamp: `2023-01-0${(i % 7) + 1} ${i % 24}:${i % 60}:${i % 60}`,
        event_type:
          i % 5 === 0
            ? "Key Rotation"
            : i % 5 === 1
              ? "Authentication"
              : i % 5 === 2
                ? "Network Access"
                : i % 5 === 3
                  ? "System Update"
                  : "Encryption",
        description:
          i % 5 === 0
            ? "Quantum key successfully rotated"
            : i % 5 === 1
              ? "User authenticated from new device"
              : i % 5 === 2
                ? "New device connected to secure network"
                : i % 5 === 3
                  ? "Security patch installed automatically"
                  : "Encryption method upgraded",
        severity: i % 4 === 0 ? "Info" : i % 4 === 1 ? "Notice" : i % 4 === 2 ? "Warning" : "Alert",
      })),
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Security Analytics</h1>
            <p className="text-muted-foreground">Detailed metrics and insights about your network security</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {timeframe === "custom" && <DatePickerWithRange className="w-full sm:w-auto" />}
            <Button variant="outline" onClick={fetchAnalyticsData} className="shrink-0" disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <SecurityScoreCard
            title="Overall Security Score"
            score={data.security_score}
            icon={Shield}
            description="Excellent security posture"
            trend={data.security_score_trend}
            positive={true}
          />
          <SecurityScoreCard
            title="Encryption Strength"
            score={data.encryption_strength}
            icon={Shield}
            description="Using quantum-safe algorithms"
            trend={data.encryption_strength_trend}
            positive={true}
          />
          <SecurityScoreCard
            title="Threat Index"
            score={data.threat_index}
            icon={AlertTriangle}
            description="Low threat level detected"
            trend={data.threat_index_trend}
            positive={true}
            inverse={true}
          />
        </div>

        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance" className="flex items-center">
              <LineChart className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Threat Detection
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center">
              <PieChart className="mr-2 h-4 w-4" />
              Encryption Methods
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <FileBar className="mr-2 h-4 w-4" />
              Security Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Encryption Performance</CardTitle>
                <CardDescription>Key performance metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <EncryptionPerformanceChart />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats">
            <Card>
              <CardHeader>
                <CardTitle>Threat Detection History</CardTitle>
                <CardDescription>Detected security threats by type and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <ThreatDetectionChart />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle>Encryption Methods Distribution</CardTitle>
                <CardDescription>Breakdown of active encryption methods in use</CardDescription>
              </CardHeader>
              <CardContent>
                <EncryptionDistributionChart />
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Security Event Logs</CardTitle>
                <CardDescription>Detailed logs of security-related events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] overflow-y-auto rounded-md border text-sm">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">Timestamp</th>
                        <th className="px-4 py-2 text-left font-medium">Event Type</th>
                        <th className="px-4 py-2 text-left font-medium">Description</th>
                        <th className="px-4 py-2 text-left font-medium">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.logs.map((log: any, i: number) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="px-4 py-2 font-mono text-xs">{log.timestamp}</td>
                          <td className="px-4 py-2">{log.event_type}</td>
                          <td className="px-4 py-2">{log.description}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                log.severity === "Info"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                  : log.severity === "Notice"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                    : log.severity === "Warning"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
