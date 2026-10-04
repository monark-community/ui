import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemDescription,
  RadioGroupItemTitle,
} from "@/components/ui/radio-group"

function Plans() {
  return (
    <RadioGroup variant="card" defaultValue="team" aria-label="Plan">
      <RadioGroupItem value="starter">
        <RadioGroupItemTitle>Starter</RadioGroupItemTitle>
        <RadioGroupItemDescription>Up to 3 members</RadioGroupItemDescription>
      </RadioGroupItem>
      <RadioGroupItem value="team">
        <RadioGroupItemTitle>Team</RadioGroupItemTitle>
        <RadioGroupItemDescription>Up to 25 members</RadioGroupItemDescription>
      </RadioGroupItem>
    </RadioGroup>
  )
}

describe("RadioGroup", () => {
  it("keeps the default dot variant", () => {
    render(
      <RadioGroup defaultValue="a" aria-label="Density">
        <RadioGroupItem value="a" aria-label="Compact" />
      </RadioGroup>
    )
    const radio = screen.getByRole("radio", { name: "Compact" })
    expect(radio).toHaveClass("size-4", "rounded-full")
    expect(radio).not.toHaveAttribute("data-variant")
  })

  it("renders card items named by their title and described by their description", () => {
    render(<Plans />)
    const team = screen.getByRole("radio", { name: "Team" })
    expect(team).toHaveAccessibleDescription("Up to 25 members")
    expect(team).toHaveAttribute("data-variant", "card")
    expect(team).toHaveAttribute("aria-checked", "true")
    expect(team).toHaveClass(
      "rounded-2xl",
      "data-checked:border-primary",
      "data-checked:bg-primary/10"
    )
  })

  it("selects a card on click and moves between cards with arrow keys", async () => {
    const user = userEvent.setup()
    render(<Plans />)
    await user.click(screen.getByRole("radio", { name: "Starter" }))
    expect(screen.getByRole("radio", { name: "Starter" })).toHaveAttribute("aria-checked", "true")
    // Radix checks the radio on arrow-key focus in browsers; jsdom only moves focus.
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("radio", { name: "Team" })).toHaveFocus()
  })
})
