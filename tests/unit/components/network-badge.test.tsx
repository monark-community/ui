import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { NetworkBadge } from "@/components/ui/network-badge"

describe("NetworkBadge", () => {
  it("renders the network name", () => {
    render(<NetworkBadge name="Base" />)
    expect(screen.getByText("Base")).toBeInTheDocument()
  })

  it("renders an icon slot when provided", () => {
    render(<NetworkBadge name="Ethereum" icon={<span data-testid="chain-icon">E</span>} />)
    expect(screen.getByTestId("chain-icon")).toBeInTheDocument()
  })

  it("marks the icon container aria-hidden so screen readers only read the name once", () => {
    const { container } = render(
      <NetworkBadge name="Ethereum" icon={<span data-testid="chain-icon">E</span>} />
    )
    const iconWrapper = container.querySelector("[aria-hidden='true']")
    expect(iconWrapper).not.toBeNull()
    expect(iconWrapper?.textContent).toBe("E")
  })

  it("applies data-slot on the root", () => {
    const { container } = render(<NetworkBadge name="Base" />)
    expect(container.querySelector("[data-slot='network-badge']")).not.toBeNull()
  })

  describe("variants", () => {
    const variants = ["default", "outline", "subtle"] as const

    for (const variant of variants) {
      it(`accepts variant="${variant}" without crashing`, () => {
        const { container } = render(<NetworkBadge name="Base" variant={variant} />)
        expect(container.firstChild).toBeTruthy()
      })
    }
  })

  it("does not render the icon wrapper when icon is omitted", () => {
    const { container } = render(<NetworkBadge name="Base" />)
    expect(container.querySelector("[aria-hidden='true']")).toBeNull()
  })
})
