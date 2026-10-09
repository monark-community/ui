"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { WalletPrompt } from "@/components/ui/wallet-prompt"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function WalletPromptPreview() {
  const { values, entries } = useControls({
    title: { type: "text", default: "Fund bounty" },
    network: { type: "text", default: "Sepolia testnet" },
    fee: { type: "text", default: "0.00042 tETH" },
    noFee: { type: "boolean", default: false },
    showAccount: { type: "boolean", default: true },
    warning: { type: "boolean", default: true },
    signingMs: { type: "number", default: 1500, min: 0, max: 10000 },
  })
  const [open, setOpen] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "signing">("idle")
  const [result, setResult] = React.useState<string | null>(null)

  return (
    <PreviewLayout controls={entries}>
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setResult(null)
            setOpen(true)
          }}
        >
          Open wallet prompt
        </Button>
        {result ? (
          <p className="text-sm text-muted-foreground">{result}</p>
        ) : null}
      </div>
      <WalletPrompt
        open={open}
        onOpenChange={setOpen}
        title={values.title || undefined}
        site="app.example.com"
        account={
          values.showAccount
            ? {
                name: "Demo wallet",
                address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
              }
            : undefined
        }
        rows={[
          { label: "Bounty", value: "Fix the login redirect" },
          { label: "Amount", value: "250 USDC" },
        ]}
        network={values.network || undefined}
        fee={values.fee}
        noFee={values.noFee}
        warning={values.warning}
        disclaimer={
          values.warning
            ? "Testnet demo · not financial advice · no real funds"
            : undefined
        }
        status={status}
        onReject={() => setResult("Rejected")}
        onConfirm={() => {
          setStatus("signing")
          window.setTimeout(() => {
            setStatus("idle")
            setOpen(false)
            setResult("Confirmed")
          }, Math.max(0, values.signingMs))
        }}
      />
    </PreviewLayout>
  )
}
