import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TxFeedback } from "@/components/ui/tx-feedback"

const HASH =
  "0x4e3a3754410177286f09d1ef56f2e60f0a2c02ded21c8c5f6dc0d8e8e0b6f4f3"

describe("TxFeedback", () => {
  it("renders nothing when idle", () => {
    const { container } = render(<TxFeedback phase="idle" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("shows the signing message in a polite status region", () => {
    render(<TxFeedback phase="signing" />)
    const region = screen.getByRole("status")
    expect(region).toHaveAttribute("aria-live", "polite")
    expect(region).toHaveTextContent(/waiting for your confirmation/i)
  })

  it("shows the pending message and a pending TxStatus with the hash", () => {
    render(<TxFeedback phase="pending" hash={HASH} pendingLabel="Funding" />)
    expect(screen.getByText("Funding")).toBeInTheDocument()
    expect(
      document.querySelector("[data-slot='tx-status'][data-status='pending']")
    ).not.toBeNull()
  })

  it("shows a confirmed TxStatus with an explorer link", () => {
    render(
      <TxFeedback
        phase="confirmed"
        hash={HASH}
        explorerUrl="https://etherscan.io"
      />
    )
    expect(screen.getByText("Confirmed")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `https://etherscan.io/tx/${HASH}`
    )
  })

  it("hides the confirmed state when hideConfirmed or no hash", () => {
    const { container, rerender } = render(
      <TxFeedback phase="confirmed" hash={HASH} hideConfirmed />
    )
    expect(container).toBeEmptyDOMElement()
    rerender(<TxFeedback phase="confirmed" />)
    expect(container).toBeEmptyDOMElement()
  })

  it("shows the failure reason as an alert", () => {
    const { rerender } = render(<TxFeedback phase="failed" error="rejected" />)
    expect(screen.getByRole("alert")).toHaveTextContent(/you rejected it/i)
    rerender(<TxFeedback phase="failed" error="reverted" />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      /failed on the network/i
    )
  })

  it("reads custom error keys from reasons, falling back to reverted", () => {
    const { rerender } = render(
      <TxFeedback
        phase="failed"
        error="slippage"
        reasons={{ slippage: "The price moved too much." }}
      />
    )
    expect(screen.getByRole("alert")).toHaveTextContent(
      "The price moved too much."
    )
    rerender(<TxFeedback phase="failed" error="unknown" />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      /failed on the network/i
    )
  })

  it("prefers an explicit reason", () => {
    render(<TxFeedback phase="failed" reason="Your tokens never left." />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your tokens never left."
    )
  })

  it("fires retry and dismiss", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const onDismiss = vi.fn()
    render(
      <TxFeedback
        phase="failed"
        hash={HASH}
        onRetry={onRetry}
        onDismiss={onDismiss}
      />
    )
    await user.click(screen.getByRole("button", { name: /try again/i }))
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(
      document.querySelector("[data-slot='tx-status'][data-status='failed']")
    ).not.toBeNull()
  })

  it("omits the action row without callbacks", () => {
    render(<TxFeedback phase="failed" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})
