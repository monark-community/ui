"use client"

import { useState } from "react"
import { SwapForm } from "@/registry/new-york/blocks/swap-form/swap-form"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const TOKENS = [
  { symbol: "ETH", name: "Ether" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "DAI", name: "Dai" },
  { symbol: "WBTC", name: "Wrapped BTC" },
]

export function SwapFormPreview() {
  const { values, entries } = useControls({
    status: {
      type: "select",
      options: ["idle", "quoting", "ready", "confirming", "error"],
      default: "ready",
    },
    slippageBps: { type: "number", default: 50, min: 0, max: 5000 },
    errorMessage: { type: "text", default: "Insufficient liquidity." },
    showRate: { type: "boolean", default: true },
    showNetworkFee: { type: "boolean", default: true },
    showMinimumReceived: { type: "boolean", default: true },
    swapLabel: { type: "text", default: "" },
  })

  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("1.0")
  const [toAmount, setToAmount] = useState("2342.15")

  function reverse() {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <PreviewLayout controls={entries}>
      <SwapForm
        tokens={TOKENS}
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
        slippageBps={values.slippageBps}
        status={values.status as "ready"}
        rate={values.showRate ? `1 ${fromToken} = 2,342.15 ${toToken}` : undefined}
        networkFee={values.showNetworkFee ? "$1.23" : undefined}
        minimumReceived={
          values.showMinimumReceived
            ? `${(Number(toAmount) * (1 - values.slippageBps / 10000)).toFixed(2)} ${toToken}`
            : undefined
        }
        errorMessage={values.status === "error" ? values.errorMessage || undefined : undefined}
        swapLabel={values.swapLabel || undefined}
        onFromTokenChange={setFromToken}
        onToTokenChange={setToToken}
        onFromAmountChange={setFromAmount}
        onToAmountChange={setToAmount}
        onReverse={reverse}
        onSwap={() => console.log("[preview] swap submitted")}
        onOpenSettings={() => console.log("[preview] open settings")}
      />
    </PreviewLayout>
  )
}
