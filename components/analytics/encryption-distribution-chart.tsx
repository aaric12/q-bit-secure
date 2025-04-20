"use client"
import { PieChart, ChartTooltip, ChartContainer, ChartLegend, ChartPie, ChartCell } from "@/components/ui/chart"

const data = [
  { name: "BB84", value: 60 },
  { name: "E91", value: 20 },
  { name: "B92", value: 10 },
  { name: "Six-State", value: 10 },
]

const COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b"]

export function EncryptionDistributionChart() {
  return (
    <div className="flex flex-col items-center justify-center h-[350px]">
      <ChartContainer width={400} height={300}>
        <PieChart>
          <ChartPie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <ChartCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </ChartPie>
          <ChartLegend />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {payload[0]?.name}: {payload[0]?.value}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payload[0]?.name === "BB84"
                          ? "Bennett and Brassard Protocol"
                          : payload[0]?.name === "E91"
                            ? "Ekert Quantum Entanglement Protocol"
                            : payload[0]?.name === "B92"
                              ? "Bennett Protocol"
                              : "Six-State Protocol"}
                      </span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
