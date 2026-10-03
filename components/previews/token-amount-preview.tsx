"use client"

import { TokenAmount } from "@/components/ui/token-amount"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function TokenAmountPreview() {
  const { values, entries } = useControls({
    value: { type: "text", default: "1234567890000000000" },
    decimals: { type: "number", default: 18, min: 0, max: 36 },
    symbol: { type: "text", default: "ETH" },
    fractionDigits: { type: "number", default: 4, min: 0, max: 20 },
    locale: {
      type: "select",
      options: ["browser", "en-US", "fr-FR", "de-DE", "ja-JP"],
      default: "browser",
    },
    showUsd: { type: "boolean", default: true },
    usdValue: { type: "number", default: 3456.78, min: 0 },
    usdCurrency: { type: "select", options: ["USD", "EUR", "GBP"], default: "USD" },
  })

  // The value is a bigint in base units; anything else typed in the control
  // would throw in BigInt(), so fall back to 0 until it parses.
  const raw = values.value.trim()
  const value = /^-?\d+$/.test(raw) ? raw : "0"
  const clamp = (n: number, min: number, max: number) =>
    Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : min

  return (
    <PreviewLayout controls={entries}>
      <TokenAmount
        value={value}
        decimals={clamp(values.decimals, 0, 36)}
        symbol={values.symbol || undefined}
        fractionDigits={clamp(values.fractionDigits, 0, 20)}
        locale={values.locale === "browser" ? undefined : values.locale}
        usdValue={values.showUsd ? values.usdValue : undefined}
        usdCurrency={values.usdCurrency}
      />
    </PreviewLayout>
  )
}
