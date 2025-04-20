"use client"
import {
  BarChart,
  ChartTooltip,
  ChartContainer,
  ChartLegend,
  ChartGrid,
  ChartXAxis,
  ChartYAxis,
  ChartBar,
} from "@/components/ui/chart"

const data = [
  {
    name: "Jan 1",
    brute: 4,
    phishing: 6,
    malware: 2,
    insider: 1,
  },
  {
    name: "Jan 2",
    brute: 3,
    phishing: 4,
    malware: 5,
    insider: 0,
  },
  {
    name: "Jan 3",
    brute: 5,
    phishing: 2,
    malware: 3,
    insider: 2,
  },
  {
    name: "Jan 4",
    brute: 2,
    phishing: 3,
    malware: 1,
    insider: 0,
  },
  {
    name: "Jan 5",
    brute: 0,
    phishing: 2,
    malware: 4,
    insider: 1,
  },
  {
    name: "Jan 6",
    brute: 1,
    phishing: 0,
    malware: 2,
    insider: 0,
  },
  {
    name: "Jan 7",
    brute: 2,
    phishing: 1,
    malware: 0,
    insider: 0,
  },
]

export function ThreatDetectionChart() {
  return (
    <ChartContainer height={350}>
      <BarChart data={data}>
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartGrid vertical={false} />
        <ChartLegend />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                      <span className="font-bold text-xs">{payload[0].payload.name}</span>
                    </div>
                    {payload.map((entry) => (
                      <div key={entry.dataKey} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 text-[0.70rem] uppercase text-muted-foreground">
                          <div className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.dataKey === "brute"
                            ? "Brute Force"
                            : entry.dataKey === "phishing"
                              ? "Phishing"
                              : entry.dataKey === "malware"
                                ? "Malware"
                                : "Insider Threats"}
                        </span>
                        <span className="font-bold text-xs">{entry.value} attempts</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <ChartBar dataKey="brute" name="Brute Force" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        <ChartBar dataKey="phishing" name="Phishing" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <ChartBar dataKey="malware" name="Malware" fill="#10b981" radius={[4, 4, 0, 0]} />
        <ChartBar dataKey="insider" name="Insider Threats" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
