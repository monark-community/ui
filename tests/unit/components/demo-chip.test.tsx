import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DemoChip } from "@/components/ui/demo-chip"

describe("DemoChip", () => {
  it("renders 'Demo' by default", () => {
    render(<DemoChip />)
    expect(screen.getByText("Demo")).toBeInTheDocument()
  })

  it("renders a custom label", () => {
    render(<DemoChip label="Démo" />)
    expect(screen.getByText("Démo")).toBeInTheDocument()
  })

  it("hides the dot from assistive tech", () => {
    const { container } = render(<DemoChip />)
    const chip = container.querySelector("[data-slot='demo-chip']")
    expect(chip?.querySelector("[aria-hidden='true']")).not.toBeNull()
    expect(chip?.textContent).toBe("Demo")
  })

  it("gives screen readers the description and sighted users a tooltip", () => {
    const { container } = render(<DemoChip description="No real funds move" />)
    const chip = container.querySelector("[data-slot='demo-chip']")
    expect(chip).toHaveAttribute("title", "No real funds move")
    expect(chip?.querySelector(".sr-only")?.textContent).toBe(": No real funds move")
  })

  it("forwards title and className", () => {
    const { container } = render(<DemoChip title="Demo · simulated data" className="extra" />)
    const chip = container.querySelector("[data-slot='demo-chip']")
    expect(chip).toHaveAttribute("title", "Demo · simulated data")
    expect(chip).toHaveClass("extra")
  })
})
