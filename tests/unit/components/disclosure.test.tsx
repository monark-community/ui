import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Disclosure } from "@/components/ui/disclosure"

describe("Disclosure", () => {
  it("starts closed and toggles its content", async () => {
    const user = userEvent.setup()
    render(<Disclosure summary="Show details">Hidden detail</Disclosure>)
    const trigger = screen.getByRole("button", { name: "Show details" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Hidden detail")).not.toBeInTheDocument()

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Hidden detail")).toBeVisible()

    await user.keyboard("{Enter}")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("respects defaultOpen", () => {
    render(
      <Disclosure summary="Details" defaultOpen>
        Shown
      </Disclosure>
    )
    expect(screen.getByText("Shown")).toBeInTheDocument()
  })

  it("keeps the icon and chevron out of the accessible name", () => {
    render(<Disclosure summary="How it works" icon={<svg data-testid="icon" />} />)
    expect(screen.getByRole("button", { name: "How it works" })).toBeInTheDocument()
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true")
  })

  it("renders the card and pill variants", () => {
    const { container, rerender } = render(<Disclosure summary="A" />)
    const root = () => container.querySelector("[data-slot='disclosure']")
    expect(root()).toHaveAttribute("data-variant", "card")
    expect(root()).toHaveClass("rounded-2xl", "border")

    rerender(<Disclosure summary="A" variant="pill" />)
    expect(root()).toHaveAttribute("data-variant", "pill")
    expect(root()).not.toHaveClass("border")
    expect(screen.getByRole("button", { name: "A" })).toHaveClass(
      "rounded-full",
      "border",
      "min-h-11"
    )
  })
})
