import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

describe("NativeSelect", () => {
  it("renders a labelled native select with options", () => {
    render(
      <>
        <label htmlFor="period">Period</label>
        <NativeSelect id="period" defaultValue="7">
          <NativeSelectOption value="3">3 days</NativeSelectOption>
          <NativeSelectOption value="7">7 days</NativeSelectOption>
        </NativeSelect>
      </>
    )
    const select = screen.getByLabelText("Period")
    expect(select.tagName).toBe("SELECT")
    expect(select).toHaveValue("7")
    expect(select).toHaveClass("rounded-full", "appearance-none", "h-10")
  })

  it("puts className on the wrapper and hides the chevron", () => {
    const { container } = render(
      <NativeSelect aria-label="Token" className="w-48">
        <option>tETH</option>
      </NativeSelect>
    )
    const wrapper = container.querySelector("[data-slot='native-select-wrapper']")
    expect(wrapper).toHaveClass("w-48")
    expect(screen.getByRole("combobox", { name: "Token" })).not.toHaveClass("w-48")
    expect(container.querySelector("[data-slot='native-select-icon']")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  })

  it("supports the sm size", () => {
    render(
      <NativeSelect aria-label="Sort" size="sm">
        <option>Newest</option>
      </NativeSelect>
    )
    const select = screen.getByRole("combobox", { name: "Sort" })
    expect(select).toHaveAttribute("data-size", "sm")
    expect(select).toHaveClass("h-9")
    expect(select).not.toHaveClass("h-10")
  })

  it("fires onChange", async () => {
    const user = userEvent.setup()
    let value = ""
    render(
      <NativeSelect
        aria-label="Token"
        onChange={(e) => {
          value = e.target.value
        }}
      >
        <option value="eth">tETH</option>
        <option value="usdc">tUSDC</option>
      </NativeSelect>
    )
    await user.selectOptions(screen.getByRole("combobox", { name: "Token" }), "usdc")
    expect(value).toBe("usdc")
  })
})
