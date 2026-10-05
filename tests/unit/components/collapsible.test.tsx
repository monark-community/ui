import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

describe("Collapsible", () => {
  it("toggles its content", async () => {
    const user = userEvent.setup()
    render(
      <Collapsible>
        <CollapsibleTrigger>More repositories</CollapsibleTrigger>
        <CollapsibleContent>monark-community/app</CollapsibleContent>
      </Collapsible>
    )
    const trigger = screen.getByRole("button", { name: "More repositories" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("monark-community/app")).not.toBeInTheDocument()

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("monark-community/app")).toBeVisible()

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("animates the content with animate-expand and keeps consumer classes", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent className="text-sm">Body</CollapsibleContent>
      </Collapsible>
    )
    const content = screen.getByText("Body")
    expect(content).toHaveAttribute("data-slot", "collapsible-content")
    expect(content).toHaveAttribute("data-state", "open")
    expect(content).toHaveClass("animate-expand", "text-sm")
  })
})
