import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ConnectWallet } from "@/components/ui/connect-wallet"

const ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

describe("ConnectWallet — disconnected state", () => {
  it("renders a connect button with the default label", () => {
    render(<ConnectWallet status="disconnected" />)
    expect(
      screen.getByRole("button", { name: /connect wallet/i })
    ).toBeInTheDocument()
  })

  it("fires onConnect when clicked", async () => {
    const user = userEvent.setup()
    const onConnect = vi.fn()
    render(<ConnectWallet status="disconnected" onConnect={onConnect} />)
    await user.click(screen.getByRole("button", { name: /connect wallet/i }))
    expect(onConnect).toHaveBeenCalledTimes(1)
  })

  it("honors a custom connectLabel", () => {
    render(
      <ConnectWallet status="disconnected" connectLabel="Sign in with wallet" />
    )
    expect(
      screen.getByRole("button", { name: "Sign in with wallet" })
    ).toBeInTheDocument()
  })
})

describe("ConnectWallet — connecting state", () => {
  it("renders a disabled button with the connecting label", () => {
    render(<ConnectWallet status="connecting" />)
    const btn = screen.getByRole("button", { name: /connecting/i })
    expect(btn).toBeDisabled()
  })

  it("does not fire onConnect when clicked while connecting", async () => {
    const user = userEvent.setup()
    const onConnect = vi.fn()
    render(<ConnectWallet status="connecting" onConnect={onConnect} />)
    await user.click(screen.getByRole("button"))
    expect(onConnect).not.toHaveBeenCalled()
  })
})

describe("ConnectWallet — connected state", () => {
  it("renders the truncated address as the trigger", () => {
    render(<ConnectWallet status="connected" address={ADDRESS} />)
    expect(screen.getByText(/0xd8dA.*6045/)).toBeInTheDocument()
  })

  it("renders the name above the address when provided", () => {
    render(
      <ConnectWallet status="connected" address={ADDRESS} name="vitalik.eth" />
    )
    expect(screen.getByText("vitalik.eth")).toBeInTheDocument()
  })

  it("opens a menu with the disconnect item on trigger click", async () => {
    const user = userEvent.setup()
    render(<ConnectWallet status="connected" address={ADDRESS} />)
    await user.click(screen.getByRole("button"))
    expect(
      await screen.findByRole("menuitem", { name: /disconnect/i })
    ).toBeInTheDocument()
  })

  it("fires onDisconnect when the menu item is selected", async () => {
    const user = userEvent.setup()
    const onDisconnect = vi.fn()
    render(
      <ConnectWallet
        status="connected"
        address={ADDRESS}
        onDisconnect={onDisconnect}
      />
    )
    await user.click(screen.getByRole("button"))
    await user.click(
      await screen.findByRole("menuitem", { name: /disconnect/i })
    )
    expect(onDisconnect).toHaveBeenCalledTimes(1)
  })

  it("falls back to the disconnected button when status='connected' but no address is provided", () => {
    render(<ConnectWallet status="connected" />)
    expect(
      screen.getByRole("button", { name: /connect wallet/i })
    ).toBeInTheDocument()
  })
})
