"use client"
import {
  LineChart,
  ChartTooltip,
  ChartContainer,
  ChartLegend,
  ChartLine,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"

const data = [
  {
    date: "2023-01-01",
    keyStrength: 92,
    securityScore: 88,
    keyExchangeSpeed: 95,
  },
  {
    date: "2023-01-02",
    keyStrength: 94,
    securityScore: 89,
    keyExchangeSpeed: 93,
  },
  {
    date: "2023-01-03",
    keyStrength: 93,
    securityScore: 91,
    keyExchangeSpeed: 94,
  },
  {
    date: "2023-01-04",
    keyStrength: 95,
    securityScore: 92,
    keyExchangeSpeed: 95,
  },
  {
    date: "2023-01-05",
    keyStrength: 97,
    securityScore: 94,
    keyExchangeSpeed: 92,
  },
  {
    date: "2023-01-06",
    keyStrength: 98,
    securityScore: 96,
    keyExchangeSpeed: 90,
  },
  {
    date: "2023-01-07",
    keyStrength: 98,
    securityScore: 97,
    keyExchangeSpeed: 91,
  },
  {
    date: "2023-01-08",
    keyStrength: 99,
    securityScore: 98,
    keyExchangeSpeed: 93,
  },
  {
    date: "2023-01-09",
    keyStrength: 99,
    securityScore: 98,
    keyExchangeSpeed: 95,
  },
  {
    date: "2023-01-10",
    keyStrength: 99,
    securityScore: 99,
    keyExchangeSpeed: 96,
  },
]

export function EncryptionPerformanceChart() {
  return (
    <ChartContainer height={350}>
      <LineChart data={data}>
        <ChartXAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        />
        <ChartYAxis tickFormatter={(value) => `${value}%`} />
        <ChartGrid vertical={false} />
        <ChartLegend />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                      <span className="font-bold text-xs">
                        {new Date(payload[0].payload.date).toLocaleDateString()}
                      </span>
                    </div>
                    {payload.map((entry) => (
                      <div key={entry.dataKey} className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">{String(entry.dataKey)}</span>
                        <span className="font-bold text-xs">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <ChartLine dataKey="keyStrength" name="Key Strength" strokeWidth={2} stroke="#10b981" />
        <ChartLine dataKey="securityScore" name="Security Score" strokeWidth={2} stroke="#6366f1" />
        <ChartLine dataKey="keyExchangeSpeed" name="Key Exchange Speed" strokeWidth={2} stroke="#f43f5e" />
      </LineChart>
    </ChartContainer>
  )
}
