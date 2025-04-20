"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield, AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react"

interface ActivityItem {
  id: string
  type: string
  message: string
  timestamp: string
  status?: string
}

interface ActivityListProps {
  items: ActivityItem[];
}

export function ActivityList({ items }: ActivityListProps) {
  const [anomalies, setAnomalies] = useState<any[]>([])
  const [loadingAnomalies, setLoadingAnomalies] = useState(true)

  useEffect(() => {
    const fetchAnomalyData = async () => {
      setLoadingAnomalies(true);
      try {
        const anomalyResponse = await fetch("/api/security/anomalies/timeline")
        const anomalyData = await anomalyResponse.json()
        if (anomalyData.anomalies) {
          const recentAnomalies = anomalyData.anomalies.filter((a: any) => a.is_anomaly).slice(0, 5)
          setAnomalies(recentAnomalies)
        }
      } catch (error) {
        console.error("Error fetching anomaly data:", error)
      } finally {
        setLoadingAnomalies(false)
      }
    }
    fetchAnomalyData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest system events and security alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px]">
          {loadingAnomalies ? (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-sm mb-2 text-destructive flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Loading Anomalies...
              </h3>
              {Array(2).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : anomalies.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-2 text-destructive flex items-center">
                 <AlertTriangle className="h-4 w-4 mr-1" />
                 Security Anomalies
              </h3>
              <div className="space-y-4">
                {anomalies.map((anomaly, index) => (
                   <div key={index} className="flex items-start gap-4">
                     <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-full">
                       <Shield className="h-4 w-4 text-red-500" />
                     </div>
                     <div>
                       <p className="text-sm font-medium">{anomaly.severity} severity anomaly detected</p>
                       <p className="text-xs text-muted-foreground">
                         Protocol: {anomaly.protocol} | QBER: {(anomaly.qber * 100).toFixed(2)}% | Date:{" "}
                         {anomaly.date}
                       </p>
                     </div>
                   </div>
                 ))}
              </div>
             </div>
          )}

          <div>
             <h3 className="font-medium text-sm mb-2 flex items-center">
               <Clock className="h-4 w-4 mr-1" />
               System Activity
             </h3>
             {items.length === 0 && !loadingAnomalies ? (
                <p className="text-sm text-muted-foreground">No recent system activity.</p>
             ) : (
                <div className="space-y-4">
                  {items.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="bg-muted p-2 rounded-full">{getActivityIcon(activity.type)}</div>
                      <div>
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.timestamp)}
                          {activity.status && ` • ${activity.status}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
             )}
           </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
