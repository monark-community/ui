import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

function Group(props: {
  variant?: "default" | "outline" | "pill" | "chip"
  size?: "sm" | "default" | "lg"
}) {
  return (
    <ToggleGroup type="single" defaultValue="active" aria-label="Status" {...props}>
      <ToggleGroupItem value="active">Active</ToggleGroupItem>
      <ToggleGroupItem value="closed">Closed</ToggleGroupItem>
    </ToggleGroup>
  )
}

describe("ToggleGroup", () => {
  it("keeps the default variant styling and spacing", () => {
    const { container } = render(<Group />)
    const root = container.querySelector("[data-slot='toggle-group']")
    expect(root).toHaveAttribute("data-spacing", "2")
    expect(screen.getByRole("radio", { name: "Active" })).toHaveClass("h-8", "rounded-lg")
  })

  it("renders the pill variant as a muted track with bg-card on the active item", () => {
    const { container } = render(<Group variant="pill" />)
    const root = container.querySelector("[data-slot='toggle-group']")
    expect(root).toHaveAttribute("data-variant", "pill")
    expect(root).not.toHaveAttribute("data-spacing")
    expect(root).toHaveClass("rounded-full", "bg-muted", "h-10")
    const active = screen.getByRole("radio", { name: "Active" })
    expect(active).toHaveAttribute("data-state", "on")
    expect(active).toHaveClass("rounded-full", "data-[state=on]:bg-card")
  })

  it("renders the chip variant as separate outlined pills with a primary tint", () => {
    const { container } = render(<Group variant="chip" size="sm" />)
    const root = container.querySelector("[data-slot='toggle-group']")
    expect(root).toHaveClass("flex-wrap", "gap-2")
    const item = screen.getByRole("radio", { name: "Closed" })
    expect(item).toHaveAttribute("data-variant", "chip")
    expect(item).toHaveClass("h-9", "rounded-full", "border-input", "data-[state=on]:bg-primary/10")
  })

  it("moves focus between items with the arrow keys", async () => {
    const user = userEvent.setup()
    render(<Group variant="pill" />)
    await user.tab()
    expect(screen.getByRole("radio", { name: "Active" })).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("radio", { name: "Closed" })).toHaveFocus()
  })

  it("toggles items in multiple mode with aria-pressed", async () => {
    const user = userEvent.setup()
    render(
      <ToggleGroup type="multiple" variant="chip" aria-label="Filters">
        <ToggleGroupItem value="a">Payments</ToggleGroupItem>
      </ToggleGroup>
    )
    const chip = screen.getByRole("button", { name: "Payments" })
    expect(chip).toHaveAttribute("aria-pressed", "false")
    await user.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
  })
})
