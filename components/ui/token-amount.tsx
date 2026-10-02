"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

// BigInt(...) rather than 0n / 10n literals: literals need a tsconfig target
// of ES2020+, and create-next-app still defaults to ES2017.
const ZERO = BigInt(0)
const TEN = BigInt(10)

/**
 * Formats an integer amount of base units (wei, satoshi, ...) as a decimal
 * string. The fraction is truncated toward zero to `maxFractionDigits`, never
 * rounded, so a balance is never displayed as more than it is. All arithmetic
 * stays in bigint, so no precision is lost however large the value.
 *
 * The whole part, the decimal separator and the fraction digits all follow
 * `locale` (e.g. "1.234,5" in de-DE).
 */
function formatBaseUnits(
  value: bigint | string | number,
  decimals: number,
  maxFractionDigits: number,
  locale?: string
) {
  const raw = typeof value === "bigint" ? value : BigInt(value)
  const negative = raw < ZERO
  const abs = negative ? -raw : raw
  const base = TEN ** BigInt(decimals)
  const whole = abs / base
  const frac = abs % base

  const format = new Intl.NumberFormat(locale)
  const wholeStr = format.format(whole)
  const fracStr =
    frac === ZERO || maxFractionDigits <= 0
      ? ""
      : frac
          .toString()
          .padStart(decimals, "0")
          .slice(0, maxFractionDigits)
          .replace(/0+$/, "")

  // A value truncated to zero (e.g. -1 wei at 4 digits) must not render "-0".
  const sign = negative && (whole !== ZERO || fracStr !== "") ? "-" : ""
  if (!fracStr) return `${sign}${wholeStr}`

  const decimalSeparator =
    format.formatToParts(1.5).find((part) => part.type === "decimal")?.value ??
    "."
  const localizedFrac = fracStr.replace(/\d/g, (digit) =>
    format.format(Number(digit))
  )
  return `${sign}${wholeStr}${decimalSeparator}${localizedFrac}`
}

function formatUsd(
  value: number,
  currency: string,
  locale?: string,
  fractionDigits = 2
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)
}

function TokenAmount({
  value,
  decimals = 18,
  symbol,
  fractionDigits = 4,
  locale,
  usdValue,
  usdCurrency = "USD",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  value: bigint | string | number
  decimals?: number
  symbol?: string
  fractionDigits?: number
  locale?: string
  usdValue?: number
  usdCurrency?: string
}) {
  const formatted = formatBaseUnits(value, decimals, fractionDigits, locale)

  return (
    <span
      data-slot="token-amount"
      className={cn("inline-flex flex-col leading-tight", className)}
      {...props}
    >
      <span className="inline-flex items-baseline gap-1 font-mono tabular-nums">
        <span>{formatted}</span>
        {symbol && (
          <span className="text-muted-foreground text-[0.85em] font-sans">
            {symbol}
          </span>
        )}
      </span>
      {typeof usdValue === "number" && (
        <span className="text-muted-foreground text-xs tabular-nums">
          {formatUsd(usdValue, usdCurrency, locale)}
        </span>
      )}
    </span>
  )
}

export { TokenAmount, formatBaseUnits, formatUsd }
