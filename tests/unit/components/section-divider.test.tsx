import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SectionDivider } from "@/components/ui/section-divider"

const rings = (c: HTMLElement) => c.querySelectorAll("[data-slot='section-divider-ring']").length

describe("SectionDivider", () => {
  it("is decorative by default", () => {
    const { container } = render(<SectionDivider />)
    const root = container.querySelector("[data-slot='section-divider']")!
    expect(root).toHaveAttribute("aria-hidden", "true")
    expect(screen.queryByRole("separator")).toBeNull()
  })

  it("exposes a separator with orientation when not decorative", () => {
    render(<SectionDivider decorative={false} orientation="vertical" />)
    const sep = screen.getByRole("separator")
    expect(sep).toHaveAttribute("aria-orientation", "vertical")
    expect(sep).not.toHaveAttribute("aria-hidden")
  })

  it("draws a ring at both ends by default", () => {
    const { container } = render(<SectionDivider />)
    expect(rings(container)).toBe(2)
    expect(container.querySelector("[data-slot='section-divider-line']")).toHaveClass("h-px")
  })

  it.each([
    ["start", 1],
    ["end", 1],
    ["none", 0],
  ] as const)("ends=%s draws %i ring(s)", (ends, n) => {
    const { container } = render(<SectionDivider ends={ends} />)
    expect(rings(container)).toBe(n)
  })

  it("keeps the ring order for start and end", () => {
    const { container: a } = render(<SectionDivider ends="start" />)
    expect(a.querySelector("[data-slot='section-divider']")!.firstElementChild).toHaveAttribute(
      "data-slot",
      "section-divider-ring"
    )
    const { container: b } = render(<SectionDivider ends="end" />)
    expect(b.querySelector("[data-slot='section-divider']")!.lastElementChild).toHaveAttribute(
      "data-slot",
      "section-divider-ring"
    )
  })

  it("draws a vertical line when vertical", () => {
    const { container } = render(<SectionDivider orientation="vertical" />)
    expect(container.querySelector("[data-slot='section-divider']")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
    expect(container.querySelector("[data-slot='section-divider-line']")).toHaveClass("w-px")
  })

  it("adds the page gutter when contained", () => {
    const { container } = render(<SectionDivider contained className="pt-16" />)
    const root = container.querySelector("[data-slot='section-divider']")!
    expect(root).toHaveClass("max-w-6xl", "mx-auto", "pt-16")
  })
})
