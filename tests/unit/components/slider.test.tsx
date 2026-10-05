import { describe, it, expect, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"
import { Slider } from "@/components/ui/slider"

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

describe("Slider", () => {
  it("names each thumb of a range via thumbLabel", () => {
    render(
      <Slider
        defaultValue={[25, 75]}
        thumbLabel={(i) => (i === 0 ? "Minimum" : "Maximum")}
        valueText={(v) => v + "%"}
      />
    )
    const [min, max] = screen.getAllByRole("slider")
    expect(min).toHaveAccessibleName("Minimum")
    expect(max).toHaveAccessibleName("Maximum")
    expect(min).toHaveAttribute("aria-valuetext", "25%")
    expect(max).toHaveAttribute("aria-valuenow", "75")
  })

  it("applies a string thumbLabel to a single thumb", () => {
    render(<Slider defaultValue={[50]} thumbLabel="Volume" />)
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuenow",
      "50"
    )
  })
})
