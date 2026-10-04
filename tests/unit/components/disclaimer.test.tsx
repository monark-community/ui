import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Disclaimer } from "@/components/ui/disclaimer"

describe("Disclaimer", () => {
  it("renders the default text inline with a hidden icon", () => {
    const { container } = render(<Disclaimer />)
    expect(screen.getByText("Testnet demo · not financial advice · no real funds")).toBeInTheDocument()
    const root = container.querySelector('[data-slot="disclaimer"]')
    expect(root?.tagName).toBe("P")
    expect(root).toHaveAttribute("data-variant", "inline")
    expect(container.querySelector('[data-slot="disclaimer-icon"]')).toHaveAttribute("aria-hidden", "true")
  })

  it("accepts custom text", () => {
    render(<Disclaimer text="Testnet demo · not tax advice · no real funds" />)
    expect(screen.getByText("Testnet demo · not tax advice · no real funds")).toBeInTheDocument()
  })

  it("renders the banner variant as a full-width strip", () => {
    const { container } = render(<Disclaimer variant="banner" role="note" />)
    expect(container.querySelector('[data-slot="disclaimer"]')).toHaveAttribute("data-variant", "banner")
    expect(screen.getByRole("note")).toHaveTextContent("no real funds")
  })

  it("drops the icon with icon={false}", () => {
    const { container } = render(<Disclaimer icon={false} />)
    expect(container.querySelector('[data-slot="disclaimer-icon"]')).toBeNull()
  })
})
