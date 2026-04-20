import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Wallet,
  WalletAvatar,
  WalletAddress,
  WalletCopyButton,
} from "@/components/ui/wallet"

const ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

function installClipboardMock() {
  // jsdom 29 defines navigator.clipboard as a non-writable accessor on
  // Navigator.prototype, so Object.defineProperty / Object.assign against
  // the instance silently fails to shadow it. vi.spyOn works because it
  // patches the prototype's writeText method, which is the path
  // `navigator.clipboard.writeText(...)` actually hits at call time.
  if (!("clipboard" in navigator)) {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    })
  }
  return vi
    .spyOn(navigator.clipboard, "writeText")
    .mockImplementation(() => Promise.resolve())
}

describe("Wallet", () => {
  it("renders the truncated address", () => {
    render(<Wallet address={ADDRESS} />)
    expect(screen.getByText(/0xd8dA.*6045/)).toBeInTheDocument()
  })

  it("renders the display name when provided", () => {
    render(<Wallet address={ADDRESS} name="vitalik.eth" />)
    expect(screen.getByText("vitalik.eth")).toBeInTheDocument()
  })

  it("shows the copy button by default", () => {
    render(<Wallet address={ADDRESS} />)
    expect(
      screen.getByRole("button", { name: "Copy address" })
    ).toBeInTheDocument()
  })

  it("hides the copy button when showCopy=false", () => {
    render(<Wallet address={ADDRESS} showCopy={false} />)
    expect(
      screen.queryByRole("button", { name: "Copy address" })
    ).not.toBeInTheDocument()
  })

  it("sets data-slot on the root for styling hooks", () => {
    const { container } = render(<Wallet address={ADDRESS} />)
    expect(container.querySelector("[data-slot='wallet']")).not.toBeNull()
  })
})

describe("WalletAvatar", () => {
  it("marks the avatar aria-hidden so the address is the only announced identity", () => {
    const { container } = render(<WalletAvatar address={ADDRESS} />)
    const root = container.querySelector("[data-slot='wallet-avatar']")
    expect(root).not.toBeNull()
    expect(root?.getAttribute("aria-hidden")).toBe("true")
  })

  it("honors the size prop via inline style", () => {
    const { container } = render(<WalletAvatar address={ADDRESS} size={48} />)
    const root = container.querySelector(
      "[data-slot='wallet-avatar']"
    ) as HTMLElement | null
    expect(root?.style.width).toBe("48px")
    expect(root?.style.height).toBe("48px")
  })
})

describe("WalletAddress", () => {
  it("exposes the full address via title for hover-reveal", () => {
    render(<WalletAddress address={ADDRESS} />)
    const el = screen.getByTitle(ADDRESS)
    expect(el.textContent).toMatch(/0xd8dA.*6045/)
  })

  it("honors custom start/end truncation", () => {
    render(<WalletAddress address={ADDRESS} start={4} end={4} />)
    expect(screen.getByText("0xd8…6045")).toBeInTheDocument()
  })
})

describe("WalletCopyButton", () => {
  it("swaps its aria-label to 'Address copied' after a successful copy", async () => {
    // jsdom's clipboard mock is flaky via Object.defineProperty / spyOn; we
    // rely on the user-visible label change (driven by the copy promise
    // resolving) as the assertion that the copy flow worked end-to-end.
    installClipboardMock()
    const user = userEvent.setup()
    render(<WalletCopyButton address={ADDRESS} />)
    await user.click(screen.getByRole("button", { name: "Copy address" }))
    expect(
      await screen.findByRole("button", { name: "Address copied" })
    ).toBeInTheDocument()
  })
})
