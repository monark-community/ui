import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Stat,
  StatDelta,
  StatGroup,
  StatHint,
  StatLabel,
  StatValue,
} from "@/components/ui/stat"

function renderStat(props: React.ComponentProps<typeof Stat> = {}) {
  return render(
    <StatGroup>
      <Stat {...props}>
        <StatLabel>Total value locked</StatLabel>
        <StatValue>$1,284,920</StatValue>
        <StatHint>Across 12 pools</StatHint>
      </Stat>
    </StatGroup>
  )
}

describe("Stat", () => {
  it("renders a description list with term and definitions", () => {
    const { container } = renderStat()
    const dl = container.querySelector("dl")
    expect(dl).toHaveAttribute("data-slot", "stat-group")
    expect(screen.getByRole("term")).toHaveTextContent("Total value locked")
    const defs = screen.getAllByRole("definition")
    expect(defs.map((d) => d.textContent)).toEqual(["$1,284,920", "Across 12 pools"])
  })

  it("sets data-slot on every part", () => {
    const { container } = renderStat()
    for (const slot of ["stat", "stat-label", "stat-value", "stat-hint"]) {
      expect(container.querySelector(`[data-slot='${slot}']`)).not.toBeNull()
    }
  })

  it("uses tabular numerals on the value", () => {
    renderStat()
    expect(screen.getByText("$1,284,920")).toHaveClass("tnum")
  })

  it("defaults to the tile variant and default tone / size", () => {
    const { container } = renderStat()
    const root = container.querySelector("[data-slot='stat']")!
    expect(root).toHaveAttribute("data-variant", "tile")
    expect(root).toHaveAttribute("data-tone", "default")
    expect(root).toHaveAttribute("data-size", "default")
    expect(root).toHaveClass("border", "bg-card", "rounded-2xl")
  })

  it("drops the tile chrome for the plain variant", () => {
    const { container } = renderStat({ variant: "plain" })
    const root = container.querySelector("[data-slot='stat']")!
    expect(root).not.toHaveClass("border")
  })

  it("exposes tone and size as data attributes", () => {
    const { container } = renderStat({ tone: "warning", size: "lg" })
    const root = container.querySelector("[data-slot='stat']")!
    expect(root).toHaveAttribute("data-tone", "warning")
    expect(root).toHaveAttribute("data-size", "lg")
  })
})

describe("StatDelta", () => {
  it("renders the change with a decorative arrow and an sr-only prefix", () => {
    const { container } = render(
      <dl>
        <StatDelta trend="down" srLabel="Down from last week:">
          -2.1%
        </StatDelta>
      </dl>
    )
    const delta = container.querySelector("[data-slot='stat-delta']")!
    expect(delta).toHaveAttribute("data-trend", "down")
    expect(delta.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
    expect(delta).toHaveTextContent("Down from last week: -2.1%")
    expect(delta).toHaveClass("text-destructive")
  })

  it("lets tone override the trend colour", () => {
    const { container } = render(
      <dl>
        <StatDelta trend="down" tone="positive">
          -0.1%
        </StatDelta>
      </dl>
    )
    expect(container.querySelector("[data-slot='stat-delta']")).toHaveClass("text-success")
  })
})
