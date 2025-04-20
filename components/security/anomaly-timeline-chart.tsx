"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function AnomalyTimelineChart() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState("30d")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/security/anomalies/timeline")

        if (!response.ok) {
          throw new Error("Failed to fetch anomaly timeline data")
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError("An error occurred while fetching the anomaly timeline")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeframe])

  const formatData = (data: any) => {
    if (!data || !data.anomalies) return []

    // Sort by date
    const sortedAnomalies = [...data.anomalies].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Format for chart
    return sortedAnomalies.map((anomaly) => ({
      date: anomaly.date.split("-").slice(1).join("/"), // Format as MM/DD
      qber: Number.parseFloat((anomaly.qber * 100).toFixed(2)),
      isAnomaly: anomaly.is_anomaly,
      protocol: anomaly.protocol,
      severity: anomaly.severity,
      confidence: anomaly.confidence,
      affectedQubits: anomaly.affected_qubits,
    }))
  }

  const getBarColor = (entry: any) => {
    if (entry.isAnomaly) {
      return entry.severity === "High" ? "#ef4444" : entry.severity === "Medium" ? "#f97316" : "#eab308"
    }
    return "#22c55e"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Anomaly Detection Timeline</CardTitle>
        <CardDescription>Historical view of quantum channel anomalies and potential security breaches</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="30d" onValueChange={setTimeframe}>
          <TabsList className="mb-4">
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="14d">14 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formatData(data)} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} interval={Math.floor(formatData(data).length / 10)} />
                    <YAxis
                      label={{
                        value: "QBER (%)",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value, name, props) => {
                        if (name === "qber") return [`${value}%`, "QBER"]
                        return [value, name]
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-background border border-border p-2 rounded-md shadow-md">
                              <p className="font-medium">{label}</p>
                              <p>QBER: {data.qber}%</p>
                              <p>Protocol: {data.protocol}</p>
                              {data.isAnomaly && (
                                <>
                                  <p className="text-destructive font-medium">Anomaly Detected</p>
                                  <p>Severity: {data.severity}</p>
                                  <p>Confidence: {(data.confidence * 100).toFixed(0)}%</p>
                                  <p>Affected Qubits: {data.affectedQubits}</p>
                                </>
                              )}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="qber" name="QBER">
                      {formatData(data).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg">Total Anomalies</h3>
                    <p className="text-3xl font-bold">{data.total_anomalies}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg">Average QBER</h3>
                    <p className="text-3xl font-bold">{(data.average_qber * 100).toFixed(2)}%</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium text-lg">Last Updated</h3>
                    <p className="text-lg font-medium">{new Date(data.last_updated).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsList>
      </CardContent>
    </Card>
  )
}
