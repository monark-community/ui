"use client"

import { TokenAmount } from "@/components/ui/token-amount"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function TokenAmountPreview() {
  const { values, entries } = useControls({
    value: { type: "text", default: "1234567890000000000" },
    decimals: { type: "number", default: 18 },
    symbol: { type: "text", default: "ETH" },
    fractionDigits: { type: "number", default: 4 },
    showUsd: { type: "boolean", default: true },
  })

  return (
    <PreviewLayout controls={entries}>
      <TokenAmount
        value={values.value || "0"}
        decimals={values.decimals}
        symbol={values.symbol || undefined}
        fractionDigits={values.fractionDigits}
        usdValue={values.showUsd ? 3456.78 : undefined}
      />
    </PreviewLayout>
  )
}
