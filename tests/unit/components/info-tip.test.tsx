import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { InfoTip } from "@/components/ui/info-tip"

describe("InfoTip", () => {
  it("renders a button named by `label`", () => {
    render(<InfoTip label="How fees work">Fee text</InfoTip>)
    const trigger = screen.getByRole("button", { name: "How fees work" })
    expect(trigger).toHaveAttribute("type", "button")
    expect(trigger).toHaveAttribute("data-slot", "info-tip")
  })

  it("falls back to an English default name", () => {
    render(<InfoTip>Fee text</InfoTip>)
    expect(screen.getByRole("button", { name: "More information" })).toBeInTheDocument()
  })

  it("hides the icon from assistive tech", () => {
    const { container } = render(<InfoTip label="Info">Fee text</InfoTip>)
    expect(container.querySelector("button svg")?.closest("[aria-hidden='true']")).not.toBeNull()
  })

  it("is closed until clicked, then shows the content and wires aria", async () => {
    const user = userEvent.setup()
    render(<InfoTip label="How fees work">A flat 0.3% fee.</InfoTip>)
    const trigger = screen.getByRole("button", { name: "How fees work" })
    expect(screen.queryByText("A flat 0.3% fee.")).toBeNull()
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)

    const content = await screen.findByText("A flat 0.3% fee.")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    const panel = content.closest("[data-slot='info-tip-content']")
    expect(panel).not.toBeNull()
    expect(trigger.getAttribute("aria-controls")).toBe(panel?.id)
  })

  it("opens from the keyboard and closes on Escape", async () => {
    const user = userEvent.setup()
    render(<InfoTip label="Info">Keyboard text</InfoTip>)
    await user.tab()
    expect(screen.getByRole("button", { name: "Info" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(await screen.findByText("Keyboard text")).toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(screen.queryByText("Keyboard text")).toBeNull()
  })

  it("supports controlled open state", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <InfoTip label="Info" open onOpenChange={onOpenChange}>
        Controlled
      </InfoTip>
    )
    expect(screen.getByText("Controlled")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Info" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("renders a custom icon and merges className on the trigger", () => {
    render(
      <InfoTip label="Info" className="-ml-1" icon={<span data-testid="custom-icon" />}>
        x
      </InfoTip>
    )
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Info" })).toHaveClass("-ml-1")
  })
})
