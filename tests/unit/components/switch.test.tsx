import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Switch } from "@/components/ui/switch"

describe("Switch", () => {
  it("defaults to the 24 x 44 size with a 20px thumb", () => {
    render(<Switch aria-label="Airplane mode" />)
    const sw = screen.getByRole("switch", { name: "Airplane mode" })
    expect(sw).toHaveAttribute("data-size", "default")
    expect(sw).toHaveClass("data-[size=default]:h-6", "data-[size=default]:w-11")
    expect(sw.querySelector("[data-slot='switch-thumb']")).toHaveClass(
      "group-data-[size=default]/switch:size-5"
    )
  })

  it.each(["sm", "lg"] as const)("supports size=%s", (size) => {
    render(<Switch aria-label="Toggle" size={size} />)
    expect(screen.getByRole("switch")).toHaveAttribute("data-size", size)
  })

  it("keeps the primary-ink edge and a 44px hit area on the small size", () => {
    render(<Switch aria-label="Toggle" size="sm" />)
    expect(screen.getByRole("switch")).toHaveClass(
      "data-checked:border-primary-ink",
      "after:absolute",
      "data-[size=sm]:after:-inset-y-3.5"
    )
  })

  it("toggles aria-checked on click", async () => {
    render(<Switch aria-label="Toggle" />)
    const sw = screen.getByRole("switch")
    expect(sw).toHaveAttribute("aria-checked", "false")
    await userEvent.click(sw)
    expect(sw).toHaveAttribute("aria-checked", "true")
  })
})
