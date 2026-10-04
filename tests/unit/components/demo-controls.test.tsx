import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  DemoControls,
  DemoControlsToggle,
} from "@/components/ui/demo-controls"

function setup(
  props: Partial<React.ComponentProps<typeof DemoControls>> = {}
) {
  const user = userEvent.setup()
  const handlers = {
    onSlowChange: vi.fn(),
    onFailNextChange: vi.fn(),
    onReset: vi.fn(),
  }
  render(
    <DemoControls slow={false} failNext={false} {...handlers} {...props} />
  )
  return { user, ...handlers }
}

describe("DemoControls", () => {
  it("renders a trigger named after openLabel and the network", () => {
    setup({ networkName: "Sepolia" })
    expect(
      screen.getByRole("button", { name: "Demo controls · Sepolia" })
    ).toBeInTheDocument()
  })

  it("shows the warning dot only while a fault is armed", () => {
    const { unmount } = render(<DemoControls slow={false} failNext={false} />)
    expect(
      document.querySelector("[data-slot='demo-controls-indicator']")
    ).toBeNull()
    unmount()
    render(<DemoControls slow failNext={false} />)
    expect(
      document.querySelector("[data-slot='demo-controls-indicator']")
    ).not.toBeNull()
  })

  it("opens the dialog and toggles the switches", async () => {
    const { user, onSlowChange, onFailNextChange } = setup()
    await user.click(screen.getByRole("button", { name: /demo controls/i }))
    expect(
      screen.getByRole("dialog", { name: "Demo controls" })
    ).toBeInTheDocument()
    await user.click(screen.getByRole("switch", { name: "Slow network" }))
    expect(onSlowChange).toHaveBeenCalledWith(true)
    await user.click(
      screen.getByRole("switch", { name: "Make the next transaction fail" })
    )
    expect(onFailNextChange).toHaveBeenCalledWith(true)
  })

  it("reflects controlled checked state", () => {
    setup({ open: true, slow: true })
    expect(
      screen.getByRole("switch", { name: "Slow network" })
    ).toHaveAttribute("aria-checked", "true")
  })

  it("renders extra toggles in the slot", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DemoControls open slow={false} failNext={false}>
        <DemoControlsToggle
          label="Ambassador"
          hint="Unlocks bounties."
          checked={false}
          onCheckedChange={onChange}
        />
      </DemoControls>
    )
    const sw = screen.getByRole("switch", { name: "Ambassador" })
    expect(sw).toHaveAccessibleDescription("Unlocks bounties.")
    await user.click(sw)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it("resets in two steps and closes", async () => {
    const onOpenChange = vi.fn()
    const { user, onReset } = setup({ defaultOpen: true, onOpenChange })
    await user.click(screen.getByRole("button", { name: /reset demo/i }))
    expect(onReset).not.toHaveBeenCalled()
    expect(
      screen.getByRole("group", { name: "Reset the demo?" })
    ).toBeInTheDocument()
    const confirm = screen.getByRole("button", { name: "Yes, reset" })
    expect(confirm).toHaveFocus()
    await user.click(confirm)
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("cancel returns to the reset button", async () => {
    const { user, onReset } = setup({ defaultOpen: true })
    await user.click(screen.getByRole("button", { name: /reset demo/i }))
    await user.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onReset).not.toHaveBeenCalled()
    expect(
      screen.getByRole("button", { name: /reset demo/i })
    ).toHaveFocus()
  })

  it("hides the reset block without onReset", () => {
    render(<DemoControls open slow={false} failNext={false} />)
    expect(
      screen.queryByRole("button", { name: /reset demo/i })
    ).not.toBeInTheDocument()
  })
})
