import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { WalletPrompt } from "@/components/ui/wallet-prompt"

const rows = [
  { label: "Bounty", value: "Fix login" },
  { label: "Amount", value: "250 USDC" },
]

describe("WalletPrompt", () => {
  it("renders nothing when closed", () => {
    render(<WalletPrompt open={false} title="Fund bounty" />)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("renders title, rows, network and fee", () => {
    render(
      <WalletPrompt
        open
        title="Fund bounty"
        rows={rows}
        network="Sepolia"
        fee="0.0004 tETH"
      />
    )
    expect(
      screen.getByRole("dialog", { name: "Fund bounty" })
    ).toBeInTheDocument()
    expect(screen.getByText("Fix login")).toBeInTheDocument()
    expect(screen.getByText("250 USDC")).toBeInTheDocument()
    expect(screen.getByText("Sepolia")).toBeInTheDocument()
    expect(screen.getByText("0.0004 tETH")).toBeInTheDocument()
    expect(
      document.querySelector("[data-slot='network-badge'] .bg-success")
    ).not.toBeNull()
  })

  it("shows the no-fee label when noFee is set", () => {
    render(<WalletPrompt open title="Vote" fee="1.5 tETH" noFee />)
    expect(screen.getByText("No fee")).toBeInTheDocument()
    expect(screen.queryByText("1.5 tETH")).not.toBeInTheDocument()
  })

  it("hides the fee row when there is no fee", () => {
    render(<WalletPrompt open title="Vote" />)
    expect(
      screen.queryByText("Estimated network fee")
    ).not.toBeInTheDocument()
  })

  it("falls back to the description as the title", () => {
    render(<WalletPrompt open />)
    expect(
      screen.getByRole("dialog", { name: "Confirm in your wallet" })
    ).toBeInTheDocument()
  })

  it("calls onConfirm", async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<WalletPrompt open title="Fund" onConfirm={onConfirm} />)
    await user.click(screen.getByRole("button", { name: "Confirm" }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it("Reject calls onReject and closes", async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <WalletPrompt
        open
        title="Fund"
        onReject={onReject}
        onOpenChange={onOpenChange}
      />
    )
    await user.click(screen.getByRole("button", { name: "Reject" }))
    expect(onReject).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("dismissing with Escape counts as a rejection", async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()
    render(<WalletPrompt open title="Fund" onReject={onReject} />)
    await user.keyboard("{Escape}")
    expect(onReject).toHaveBeenCalledTimes(1)
  })

  it("disables actions and ignores dismissal while signing", async () => {
    const user = userEvent.setup()
    const onReject = vi.fn()
    render(
      <WalletPrompt open title="Fund" status="signing" onReject={onReject} />
    )
    expect(screen.getByRole("button", { name: /confirming/i })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Reject" })).toBeDisabled()
    expect(
      screen.queryByRole("button", { name: "Close" })
    ).not.toBeInTheDocument()
    await user.keyboard("{Escape}")
    expect(onReject).not.toHaveBeenCalled()
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-busy", "true")
  })

  it("renders the signing account and custom labels", () => {
    render(
      <WalletPrompt
        open
        title="Fund"
        account={{
          name: "Alice",
          address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        }}
        accountLabel="Signing as"
        confirmLabel="Confirmer"
        rejectLabel="Refuser"
      />
    )
    expect(screen.getByText("Alice")).toBeInTheDocument()
    expect(screen.getByText("Signing as")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Confirmer" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Refuser" })).toBeInTheDocument()
  })
})
