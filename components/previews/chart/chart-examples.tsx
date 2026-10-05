"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const CHART_TYPES = [
  "bar",
  "bar-stacked",
  "bar-horizontal",
  "line",
  "area",
  "area-stacked",
  "area-gradient",
  "pie",
  "donut",
  "radar",
  "radial",
] as const

export type ChartType = (typeof CHART_TYPES)[number]
export type TooltipIndicator = "dot" | "line" | "dashed"

/* ── Sample data ─────────────────────────────────────────────────────── */

/** Monthly settlement volume, in millions of USD. */
const VOLUME = [
  { month: "Jan", eth: 186, usdc: 80 },
  { month: "Feb", eth: 305, usdc: 200 },
  { month: "Mar", eth: 237, usdc: 120 },
  { month: "Apr", eth: 73, usdc: 190 },
  { month: "May", eth: 209, usdc: 130 },
  { month: "Jun", eth: 214, usdc: 140 },
]

const volumeConfig = {
  eth: { label: "ETH", color: "var(--chart-1)" },
  usdc: { label: "USDC", color: "var(--chart-2)" },
} satisfies ChartConfig

/** Treasury allocation, in thousands of USD. */
const ALLOCATION = [
  { token: "eth", value: 1820, fill: "var(--color-eth)" },
  { token: "usdc", value: 1240, fill: "var(--color-usdc)" },
  { token: "wbtc", value: 640, fill: "var(--color-wbtc)" },
  { token: "sol", value: 310, fill: "var(--color-sol)" },
  { token: "other", value: 190, fill: "var(--color-other)" },
]

const allocationConfig = {
  value: { label: "Holdings ($k)" },
  eth: { label: "ETH", color: "var(--chart-1)" },
  usdc: { label: "USDC", color: "var(--chart-2)" },
  wbtc: { label: "WBTC", color: "var(--chart-3)" },
  sol: { label: "SOL", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

/** Protocol risk scores, 0–100. */
const SCORES = [
  { metric: "Security", aave: 92, uniswap: 88 },
  { metric: "Liquidity", aave: 84, uniswap: 95 },
  { metric: "Decentralisation", aave: 71, uniswap: 80 },
  { metric: "Uptime", aave: 98, uniswap: 97 },
  { metric: "Audits", aave: 90, uniswap: 76 },
  { metric: "Governance", aave: 78, uniswap: 69 },
]

const scoresConfig = {
  aave: { label: "Aave", color: "var(--chart-1)" },
  uniswap: { label: "Uniswap", color: "var(--chart-2)" },
} satisfies ChartConfig

/** Lending pool utilisation, in percent. */
const UTILISATION = [
  { pool: "usdc", utilisation: 82, fill: "var(--color-usdc)" },
  { pool: "eth", utilisation: 64, fill: "var(--color-eth)" },
  { pool: "dai", utilisation: 47, fill: "var(--color-dai)" },
  { pool: "wbtc", utilisation: 29, fill: "var(--color-wbtc)" },
]

const utilisationConfig = {
  utilisation: { label: "Utilisation (%)" },
  usdc: { label: "USDC", color: "var(--chart-1)" },
  eth: { label: "ETH", color: "var(--chart-2)" },
  dai: { label: "DAI", color: "var(--chart-3)" },
  wbtc: { label: "WBTC", color: "var(--chart-4)" },
} satisfies ChartConfig

const CONFIG: Record<ChartType, ChartConfig> = {
  bar: volumeConfig,
  "bar-stacked": volumeConfig,
  "bar-horizontal": volumeConfig,
  line: volumeConfig,
  area: volumeConfig,
  "area-stacked": volumeConfig,
  "area-gradient": volumeConfig,
  pie: allocationConfig,
  donut: allocationConfig,
  radar: scoresConfig,
  radial: utilisationConfig,
}

const TOTAL_ALLOCATION = ALLOCATION.reduce((sum, d) => sum + d.value, 0)

/* ── Renderer ───────────────────────────────────────────────────────── */

export interface ChartExampleProps {
  type: ChartType
  indicator?: TooltipIndicator
  legend?: boolean
  className?: string
}

export function ChartExample({
  type,
  indicator = "dot",
  legend = false,
  className = "aspect-auto h-72 w-[min(40rem,calc(100vw-4rem))]",
}: ChartExampleProps) {
  const gradientId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")

  const xAxis = (
    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
  )
  const tooltip = (
    <ChartTooltip
      cursor={type.startsWith("bar")}
      content={<ChartTooltipContent indicator={indicator} />}
    />
  )
  const cartesianLegend = legend ? (
    <ChartLegend content={<ChartLegendContent />} />
  ) : null

  let chart: React.ReactElement
  switch (type) {
    case "bar":
    case "bar-stacked":
      chart = (
        <BarChart accessibilityLayer data={VOLUME}>
          <CartesianGrid vertical={false} />
          {xAxis}
          {tooltip}
          {cartesianLegend}
          {type === "bar" ? (
            <>
              <Bar dataKey="eth" fill="var(--color-eth)" radius={4} />
              <Bar dataKey="usdc" fill="var(--color-usdc)" radius={4} />
            </>
          ) : (
            <>
              <Bar dataKey="eth" stackId="a" fill="var(--color-eth)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="usdc" stackId="a" fill="var(--color-usdc)" radius={[4, 4, 0, 0]} />
            </>
          )}
        </BarChart>
      )
      break

    case "bar-horizontal":
      chart = (
        <BarChart accessibilityLayer data={VOLUME} layout="vertical" margin={{ left: -20 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="month"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          {tooltip}
          {cartesianLegend}
          <Bar dataKey="eth" fill="var(--color-eth)" radius={4} />
          <Bar dataKey="usdc" fill="var(--color-usdc)" radius={4} />
        </BarChart>
      )
      break

    case "line":
      chart = (
        <LineChart accessibilityLayer data={VOLUME} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          {xAxis}
          {tooltip}
          {cartesianLegend}
          <Line type="monotone" dataKey="eth" stroke="var(--color-eth)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="usdc" stroke="var(--color-usdc)" strokeWidth={2} dot={false} />
        </LineChart>
      )
      break

    case "area":
    case "area-stacked":
    case "area-gradient": {
      const stacked = type === "area-stacked"
      const gradient = type === "area-gradient"
      const fillFor = (key: "eth" | "usdc") =>
        gradient ? `url(#${gradientId}-${key})` : `var(--color-${key})`
      chart = (
        <AreaChart accessibilityLayer data={VOLUME} margin={{ left: 12, right: 12 }}>
          {gradient ? (
            <defs>
              {(["eth", "usdc"] as const).map((key) => (
                <linearGradient key={key} id={`${gradientId}-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
          ) : null}
          <CartesianGrid vertical={false} />
          {xAxis}
          {tooltip}
          {cartesianLegend}
          <Area
            type="natural"
            dataKey="usdc"
            stackId={stacked ? "a" : undefined}
            fill={fillFor("usdc")}
            fillOpacity={gradient ? 1 : 0.4}
            stroke="var(--color-usdc)"
          />
          <Area
            type="natural"
            dataKey="eth"
            stackId={stacked ? "a" : undefined}
            fill={fillFor("eth")}
            fillOpacity={gradient ? 1 : 0.4}
            stroke="var(--color-eth)"
          />
        </AreaChart>
      )
      break
    }

    case "pie":
    case "donut":
      chart = (
        <PieChart accessibilityLayer>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="token" indicator={indicator} hideLabel />}
          />
          {legend ? (
            <ChartLegend content={<ChartLegendContent nameKey="token" />} />
          ) : null}
          <Pie
            data={ALLOCATION}
            dataKey="value"
            nameKey="token"
            innerRadius={type === "donut" ? 60 : 0}
            strokeWidth={2}
            stroke="var(--background)"
          >
            {type === "donut" ? (
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
                  const { cx, cy } = viewBox as { cx: number; cy: number }
                  return (
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={cx} y={cy} className="fill-foreground text-2xl font-bold">
                        ${(TOTAL_ALLOCATION / 1000).toFixed(1)}M
                      </tspan>
                      <tspan x={cx} y={cy + 22} className="fill-muted-foreground">
                        Treasury
                      </tspan>
                    </text>
                  )
                }}
              />
            ) : null}
          </Pie>
        </PieChart>
      )
      break

    case "radar":
      chart = (
        <RadarChart accessibilityLayer data={SCORES}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator={indicator} />} />
          {cartesianLegend}
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <Radar
            dataKey="aave"
            fill="var(--color-aave)"
            fillOpacity={0.5}
            stroke="var(--color-aave)"
          />
          <Radar
            dataKey="uniswap"
            fill="var(--color-uniswap)"
            fillOpacity={0.3}
            stroke="var(--color-uniswap)"
          />
        </RadarChart>
      )
      break

    case "radial":
      chart = (
        <RadialBarChart
          accessibilityLayer
          data={UTILISATION}
          innerRadius={40}
          outerRadius={120}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="pool" indicator={indicator} hideLabel />}
          />
          {legend ? (
            <ChartLegend content={<ChartLegendContent nameKey="pool" />} />
          ) : null}
          <RadialBar dataKey="utilisation" background cornerRadius={8} />
        </RadialBarChart>
      )
      break
  }

  return (
    <ChartContainer config={CONFIG[type]} className={className}>
      {chart}
    </ChartContainer>
  )
}
