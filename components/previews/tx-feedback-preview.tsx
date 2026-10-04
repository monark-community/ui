"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { TxFeedback, type TxFeedbackPhase } from "@/components/ui/tx-feedback"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const HASH =
  "0x4e3a3754410177286f09d1ef56f2e60f0a2c02ded21c8c5f6dc0d8e8e0b6f4f3"

export function TxFeedbackPreview() {
  const { values, entries } = useControls({
    phase: {
      type: "select",
      options: ["signing", "pending", "confirmed", "failed", "idle"],
      default: "pending",
    },
    error: {
      type: "select",
      options: ["reverted", "rejected", "expired"],
      default: "reverted",
    },
    withHash: { type: "boolean", default: true },
    explorerUrl: { type: "text", default: "https://sepolia.etherscan.io" },
  })
  const [override, setOverride] = React.useState<TxFeedbackPhase | null>(null)
  const phase = override ?? (values.phase as TxFeedbackPhase)

  React.useEffect(() => setOverride(null), [values.phase])

  return (
    <PreviewLayout controls={entries}>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <TxFeedback
          phase={phase}
          hash={values.withHash ? HASH : undefined}
          error={values.error}
          explorerUrl={values.explorerUrl || undefined}
          onRetry={() => setOverride("signing")}
          onDismiss={() => setOverride("idle")}
        />
        {phase === "idle" ? (
          <Button variant="outline" size="sm" onClick={() => setOverride(null)}>
            Show again
          </Button>
        ) : null}
      </div>
    </PreviewLayout>
  )
}
