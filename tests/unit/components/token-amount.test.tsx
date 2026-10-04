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

  it("truncates toward zero instead of rounding", () => {
    // 1.99999 ETH shows 1.9999, never 2: a balance is not overstated.
    expect(formatBaseUnits(1_999_990_000_000_000_000n, 18, 4, "en-US")).toBe("1.9999")
    expect(formatBaseUnits(-1_999_990_000_000_000_000n, 18, 4, "en-US")).toBe("-1.9999")
  })

  it("keeps every digit of values far beyond Number.MAX_SAFE_INTEGER", () => {
    // 123,456,789,012.123456789012345678 ETH, all 18 decimals requested
    expect(
      formatBaseUnits(123_456_789_012_123_456_789_012_345_678n, 18, 18, "en-US")
    ).toBe("123,456,789,012.123456789012345678")
    expect(
      formatBaseUnits("123456789012123456789012345678", 18, 18, "en-US")
    ).toBe("123,456,789,012.123456789012345678")
  })

  it("keeps leading zeros of the fraction", () => {
    // 0.000123 USDC (6 decimals) => 0.0001 at 4 digits
    expect(formatBaseUnits(123n, 6, 4, "en-US")).toBe("0.0001")
    expect(formatBaseUnits(123n, 6, 6, "en-US")).toBe("0.000123")
  })

  it("never renders a negative zero when the value truncates to zero", () => {
    expect(formatBaseUnits(-1n, 18, 4, "en-US")).toBe("0")
    expect(formatBaseUnits(-1n, 18, 0, "en-US")).toBe("0")
    expect(formatBaseUnits(-500_000n, 6, 0, "en-US")).toBe("0")
  })

  it("handles decimals = 0 (integer tokens)", () => {
    expect(formatBaseUnits(1234n, 0, 4, "en-US")).toBe("1,234")
  })

  it("uses the locale's decimal separator, not a hardcoded dot", () => {
    // Before: de-DE rendered "1.234.5" (grouping and decimal both a dot).
    expect(formatBaseUnits(1_234_500_000_000_000_000_000n, 18, 4, "de-DE")).toBe("1.234,5")
    expect(formatBaseUnits(1_500_000n, 6, 4, "fr-FR")).toBe("1,5")
  })

  it("localizes the fraction digits along with the whole part", () => {
    const expected = new Intl.NumberFormat("ar-EG").format(1.25)
    expect(formatBaseUnits(1_250_000n, 6, 4, "ar-EG")).toBe(expected)
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

describe("formatBaseUnits minFractionDigits", () => {
  it("pads the fraction with zeros", () => {
    expect(formatBaseUnits(1_500_000n, 6, 4, "en-US", 2)).toBe("1.50")
    expect(formatBaseUnits(2_000_000n, 6, 4, "en-US", 2)).toBe("2.00")
  })

  it("never pads past maxFractionDigits", () => {
    expect(formatBaseUnits(1_000_000n, 6, 1, "en-US", 3)).toBe("1.0")
  })

  it("does not show -0.00 for a negative value truncated to zero", () => {
    expect(formatBaseUnits(-1n, 6, 2, "en-US", 2)).toBe("0.00")
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

  it("uses the mono font only when asked", () => {
    const { container, rerender } = render(<TokenAmount value={0n} />)
    expect(container.querySelector(".font-mono")).toBeNull()
    rerender(<TokenAmount value={0n} mono />)
    expect(container.querySelector(".font-mono")).not.toBeNull()
  })

  it("applies data-slot on the root for styling hooks", () => {
    const { container } = render(<TokenAmount value={0n} />)
    expect(container.querySelector("[data-slot='token-amount']")).not.toBeNull()
  })
})
