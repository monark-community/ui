import { describe, it, expect, beforeAll } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

beforeAll(() => {
  // Radix Select needs these in jsdom.
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

function renderOpen(position?: "popper" | "item-aligned") {
  render(
    <Select open defaultValue="apple">
      <SelectTrigger aria-label="Fruit" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position={position}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  )
  return screen.getByRole("listbox")
}

describe("Select", () => {
  it("defaults to popper, at least as wide as the trigger (9rem floor)", () => {
    const listbox = renderOpen()
    expect(listbox).toHaveAttribute("data-align-trigger", "false")
    expect(listbox).toHaveClass(
      "min-w-[max(9rem,var(--radix-select-trigger-width))]",
      "rounded-2xl"
    )
    expect(listbox).not.toHaveClass("min-w-36")
    expect(listbox.querySelector("[data-position]")).toHaveAttribute(
      "data-position",
      "popper"
    )
  })

  it("still supports item-aligned", () => {
    const listbox = renderOpen("item-aligned")
    expect(listbox).toHaveAttribute("data-align-trigger", "true")
    expect(listbox).toHaveClass("min-w-36")
  })
})
