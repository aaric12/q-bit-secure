"use client"

import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SecurityScoreCardProps {
  title: string
  score: number
  icon: LucideIcon
  description: string
  trend: string
  positive: boolean
  inverse?: boolean
}

export function SecurityScoreCard({
  title,
  score,
  icon: Icon,
  description,
  trend,
  positive,
  inverse = false,
}: SecurityScoreCardProps) {
  const color = inverse
    ? score < 10
      ? "text-green-500"
      : score < 30
        ? "text-yellow-500"
        : "text-red-500"
    : score > 90
      ? "text-green-500"
      : score > 70
        ? "text-yellow-500"
        : "text-red-500"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center pt-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`text-3xl font-bold ${color}`}>
              {score}
              {!inverse && "%"}
            </div>
          </motion.div>
          <p className="text-xs text-center text-muted-foreground mt-1">{description}</p>
          <div className="flex items-center text-xs mt-2">
            {positive ? (
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={positive ? "text-green-500" : "text-red-500"}>{trend}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
