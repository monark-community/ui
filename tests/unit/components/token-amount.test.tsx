import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  TokenAmount,
  formatBaseUnits,
  formatUsd,
} from "@/components/ui/token-amount"

describe("formatBaseUnits", () => {
  it("formats 1 ETH from wei", () => {
    expect(formatBaseUnits(1_000_000_000_000_000_000n, 18, 4, "en-US")).toBe("1")
  })

  it("truncates fractional digits and strips trailing zeros", () => {
    // 1.23456 ETH with maxFractionDigits=4 => "1.2345" (trailing 6 dropped)
    expect(formatBaseUnits(1_234_560_000_000_000_000n, 18, 4, "en-US")).toBe("1.2345")
  })

  it("drops the entire fractional part when fractionDigits is 0", () => {
    expect(formatBaseUnits(1_500_000_000_000_000_000n, 18, 0, "en-US")).toBe("1")
  })

  it("renders a negative sign for negative values", () => {
    expect(formatBaseUnits(-1_500_000_000_000_000_000n, 18, 4, "en-US")).toBe("-1.5")
  })

  it("accepts string and number inputs", () => {
    expect(formatBaseUnits("2000000", 6, 4, "en-US")).toBe("2")
    expect(formatBaseUnits(500_000, 6, 4, "en-US")).toBe("0.5")
  })

  it("includes thousand separators for whole integers", () => {
    // 1234 ETH in wei, formatted with en-US locale
    expect(formatBaseUnits(1_234_000_000_000_000_000_000n, 18, 4, "en-US")).toBe(
      "1,234"
    )
  })

  it("returns 0 when frac is zero and value is 0", () => {
    expect(formatBaseUnits(0n, 18, 4, "en-US")).toBe("0")
  })
})

describe("formatUsd", () => {
  it("formats with currency and 2 fraction digits by default", () => {
    expect(formatUsd(3456.78, "USD", "en-US")).toBe("$3,456.78")
  })

  it("respects currency override", () => {
    // Euro sign + standard en-US currency grouping
    expect(formatUsd(100, "EUR", "en-US")).toBe("€100.00")
  })
})

describe("TokenAmount", () => {
  it("renders amount with symbol", () => {
    render(<TokenAmount value={1_000_000_000_000_000_000n} symbol="ETH" />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("ETH")).toBeInTheDocument()
  })

  it("renders the USD line when usdValue is a number", () => {
    render(
      <TokenAmount
        value={1_000_000_000_000_000_000n}
        symbol="ETH"
        usdValue={3456.78}
        locale="en-US"
      />
    )
    expect(screen.getByText("$3,456.78")).toBeInTheDocument()
  })

  it("hides the USD line when usdValue is undefined", () => {
    render(<TokenAmount value={1_000_000_000_000_000_000n} symbol="ETH" />)
    expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
  })

  it("hides the symbol when not provided", () => {
    const { container } = render(
      <TokenAmount value={1_000_000_000_000_000_000n} />
    )
    // The only visible text should be the formatted amount
    expect(container.textContent).toBe("1")
  })

  it("applies data-slot on the root for styling hooks", () => {
    const { container } = render(<TokenAmount value={0n} />)
    expect(container.querySelector("[data-slot='token-amount']")).not.toBeNull()
  })
})
