import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { Bar, BarChart } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { CHART_TYPES, ChartExample } from "@/components/previews/chart/chart-examples"

// jsdom lays everything out at 0x0, so a measured ResponsiveContainer would
// draw nothing. Without a ResizeObserver, Recharts keeps ChartContainer's
// initialDimension (320x200) and renders the SVG at that size.
const originalResizeObserver = globalThis.ResizeObserver

beforeAll(() => {
  // @ts-expect-error -- removed on purpose for the duration of this file
  delete globalThis.ResizeObserver
})

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver
})

describe("ChartContainer", () => {
  it("writes a --color-<key> variable per ChartConfig entry", () => {
    const config = {
      eth: { label: "ETH", color: "var(--chart-1)" },
      usdc: { label: "USDC", theme: { light: "#111111", dark: "#eeeeee" } },
    } satisfies ChartConfig

    const { container } = render(
      <ChartContainer config={config} id="test">
        <BarChart data={[{ m: "Jan", eth: 1, usdc: 2 }]}>
          <Bar dataKey="eth" fill="var(--color-eth)" />
        </BarChart>
      </ChartContainer>
    )

    const root = container.querySelector("[data-slot='chart']")
    expect(root).toHaveAttribute("data-chart", "chart-test")
    const css = container.querySelector("style")?.textContent ?? ""
    expect(css).toContain("--color-eth: var(--chart-1)")
    expect(css).toContain("--color-usdc: #111111")
    expect(css).toMatch(/\.dark \[data-chart=chart-test\][^}]*--color-usdc: #eeeeee/)
  })
})

describe("Chart types", () => {
  it.each(CHART_TYPES)("renders %s without crashing", (type) => {
    const { container } = render(<ChartExample type={type} className="h-72 w-96" />)
    expect(container.querySelector("[data-slot='chart']")).toBeInTheDocument()
    expect(container.querySelector("svg.recharts-surface")).toBeInTheDocument()
  })

  it.each(CHART_TYPES)("renders %s with a legend", (type) => {
    const { container } = render(
      <ChartExample type={type} legend indicator="dashed" className="h-72 w-96" />
    )
    expect(container.querySelector("svg.recharts-surface")).toBeInTheDocument()
  })

  it("makes the chart surface keyboard-focusable via accessibilityLayer", () => {
    const { container } = render(<ChartExample type="bar" className="h-72 w-96" />)
    const surface = container.querySelector("svg.recharts-surface")
    expect(surface).toHaveAttribute("tabindex", "0")
  })

  it("centres the total inside the donut", () => {
    const { container } = render(<ChartExample type="donut" className="h-72 w-96" />)
    expect(container.querySelector(".recharts-pie")?.textContent).toContain("$4.2M")
  })

  it("fills the gradient area from the chart colour variables", () => {
    const { container } = render(<ChartExample type="area-gradient" className="h-72 w-96" />)
    const stops = container.querySelectorAll("defs stop")
    expect(stops.length).toBe(4)
    expect(stops[0]).toHaveAttribute("stop-color", "var(--color-eth)")
  })
})
