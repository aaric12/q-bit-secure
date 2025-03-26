"use client"

import { AlertTriangle, Check, Clock, Info, Shield, User } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "info",
    message: "Daily key rotation completed successfully",
    time: "2 hours ago",
    icon: Check,
    iconColor: "text-green-500",
  },
  {
    id: 2,
    type: "security",
    message: "New device authenticated to network",
    time: "4 hours ago",
    icon: Shield,
    iconColor: "text-blue-500",
  },
  {
    id: 3,
    type: "warning",
    message: "Attempted access with expired credentials",
    time: "Yesterday, 23:14",
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
  },
  {
    id: 4,
    type: "info",
    message: "System update installed automatically",
    time: "Yesterday, 19:32",
    icon: Info,
    iconColor: "text-primary",
  },
  {
    id: 5,
    type: "security",
    message: "Quantum key distribution initiated",
    time: "Yesterday, 16:45",
    icon: Clock,
    iconColor: "text-purple-500",
  },
  {
    id: 6,
    type: "info",
    message: "Admin user logged in from new location",
    time: "2 days ago",
    icon: User,
    iconColor: "text-gray-500",
  },
]

export function ActivityList() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`${activity.iconColor} mt-0.5`}>
            <activity.icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm">{activity.message}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

