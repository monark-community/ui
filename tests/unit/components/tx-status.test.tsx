import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { TxStatus, truncateHash } from "@/components/ui/tx-status"

const HASH =
  "0x4e3a3754410177286f09d1ef56f2e60f0a2c02ded21c8c5f6dc0d8e8e0b6f4f3"

describe("truncateHash", () => {
  it("truncates long hashes to start+ellipsis+end", () => {
    expect(truncateHash(HASH)).toBe("0x4e3a37…b6f4f3")
  })

  it("returns short strings unchanged", () => {
    expect(truncateHash("0xabc")).toBe("0xabc")
  })

  it("honors custom start/end lengths", () => {
    expect(truncateHash(HASH, 4, 4)).toBe("0x4e…f4f3")
  })
})

describe("TxStatus", () => {
  it("renders the default label for each status", () => {
    const { rerender } = render(<TxStatus status="pending" hash={HASH} />)
    expect(screen.getByText("Pending")).toBeInTheDocument()

    rerender(<TxStatus status="confirmed" hash={HASH} />)
    expect(screen.getByText("Confirmed")).toBeInTheDocument()

    rerender(<TxStatus status="failed" hash={HASH} />)
    expect(screen.getByText("Failed")).toBeInTheDocument()
  })

  it("renders the truncated hash", () => {
    render(<TxStatus status="confirmed" hash={HASH} />)
    expect(screen.getByText(/0x4e3a37.*6f4f3/)).toBeInTheDocument()
  })

  it("renders hash as a plain span when no explorerUrl is provided", () => {
    render(<TxStatus status="confirmed" hash={HASH} />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })

  it("builds an explorer link from explorerUrl + /tx/{hash}", () => {
    render(
      <TxStatus status="confirmed" hash={HASH} explorerUrl="https://etherscan.io" />
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", `https://etherscan.io/tx/${HASH}`)
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("prefers an explicit href over explorerUrl composition", () => {
    render(
      <TxStatus
        status="confirmed"
        hash={HASH}
        explorerUrl="https://etherscan.io"
        href="https://custom.example/tx/123"
      />
    )
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://custom.example/tx/123"
    )
  })

  it("strips a trailing slash from explorerUrl before composing", () => {
    render(
      <TxStatus status="confirmed" hash={HASH} explorerUrl="https://etherscan.io/" />
    )
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `https://etherscan.io/tx/${HASH}`
    )
  })

  it("honors a custom label override", () => {
    render(<TxStatus status="pending" hash={HASH} label="Broadcasting…" />)
    expect(screen.getByText("Broadcasting…")).toBeInTheDocument()
    expect(screen.queryByText("Pending")).not.toBeInTheDocument()
  })

  it("exposes the status via data-status for styling hooks", () => {
    const { container } = render(<TxStatus status="failed" hash={HASH} />)
    expect(
      container.querySelector("[data-slot='tx-status'][data-status='failed']")
    ).not.toBeNull()
  })
})
