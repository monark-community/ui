import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Calendar } from "@/components/ui/calendar"

// 2026-10-10 is a Saturday, 2026-10-04 a Sunday.
const SATURDAY = new Date(2026, 9, 10)
const SUNDAY = new Date(2026, 9, 4)

function dayCell(container: HTMLElement, iso: string) {
  const cell = container.querySelector<HTMLElement>(`td[data-day='${iso}']`)
  if (!cell) throw new Error(`no cell for ${iso}`)
  return cell
}

describe("Calendar", () => {
  it.each([
    ["Saturday", SATURDAY, "2026-10-10"],
    ["Sunday", SUNDAY, "2026-10-04"],
  ] as const)("keeps a selected %s a single-day circle in single mode", (_, date, iso) => {
    const { container } = render(
      <Calendar mode="single" selected={date} defaultMonth={date} />
    )
    const cell = dayCell(container, iso)
    const button = cell.querySelector("button")!

    expect(cell).toHaveAttribute("data-selected", "true")
    expect(button).toHaveAttribute("data-selected-single", "true")
    expect(button).not.toHaveAttribute("data-range-start", "true")
    expect(button).not.toHaveAttribute("data-range-end", "true")
    expect(button).not.toHaveAttribute("data-range-middle", "true")

    // The week-edge rounding only targets range-middle buttons, never a
    // single selected day.
    const edgeRules = cell.className
      .split(/\s+/)
      .filter((c) => /^\[&:(first|last|nth)-child/.test(c))
    expect(edgeRules.length).toBeGreaterThan(0)
    for (const rule of edgeRules) {
      expect(rule).toContain("button[data-range-middle=true]")
    }
  })

  it("marks range-middle days so edge rounding applies across week rows", () => {
    const from = new Date(2026, 9, 8)
    const to = new Date(2026, 9, 14)
    const { container } = render(
      <Calendar mode="range" selected={{ from, to }} defaultMonth={from} />
    )
    const saturday = dayCell(container, "2026-10-10").querySelector("button")!
    expect(saturday).toHaveAttribute("data-range-middle", "true")
    expect(saturday).toHaveAttribute("data-selected-single", "false")
    expect(
      dayCell(container, "2026-10-08").querySelector("button")
    ).toHaveAttribute("data-range-start", "true")
  })

  it("clears today's muted background behind a single selected day", () => {
    const { container } = render(
      <Calendar mode="single" selected={SUNDAY} defaultMonth={SUNDAY} today={SUNDAY} />
    )
    const cell = dayCell(container, "2026-10-04")
    expect(cell).toHaveAttribute("data-today", "true")
    expect(cell).toHaveClass("has-data-[selected-single=true]:bg-transparent")
  })
})
