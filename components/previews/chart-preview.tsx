"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const DATA = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig

export function ChartPreview() {
  const { values, entries } = useControls({
    type: { type: "select", options: ["bar", "line"], default: "bar" },
  })

  return (
    <PreviewLayout controls={entries}>
      <ChartContainer config={config} className="h-64 w-full max-w-md">
        {values.type === "bar" ? (
          <BarChart data={DATA}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        ) : (
          <LineChart data={DATA}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
          </LineChart>
        )}
      </ChartContainer>
    </PreviewLayout>
  )
}
