"use client"

import type React from "react"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartContainerProps {
  children: React.ReactNode
  width?: number | string
  height?: number | string
  data?: any[]
  xAxisType?: string
}

export function ChartContainer({ children, width = "100%", height = 350, ...props }: ChartContainerProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      {children}
    </ResponsiveContainer>
  )
}

export function LineChart({ children, ...props }: React.ComponentProps<typeof RechartsLineChart>) {
  return <RechartsLineChart {...props}>{children}</RechartsLineChart>
}

export function BarChart({ children, ...props }: React.ComponentProps<typeof RechartsBarChart>) {
  return <RechartsBarChart {...props}>{children}</RechartsBarChart>
}

export function PieChart({ children, ...props }: React.ComponentProps<typeof RechartsPieChart>) {
  return <RechartsPieChart {...props}>{children}</RechartsPieChart>
}

export const ChartLine = Line
export const ChartBar = Bar
export const ChartPie = Pie
export const ChartCell = Cell
export const ChartXAxis = XAxis
export const ChartYAxis = YAxis
export const ChartGrid = CartesianGrid
export const ChartTooltip = Tooltip
export const ChartLegend = Legend
