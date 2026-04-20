"use client"

import { TxStatus } from "@/components/ui/tx-status"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function TxStatusPreview() {
  const { values, entries } = useControls({
    status: {
      type: "select",
      options: ["pending", "confirmed", "failed"],
      default: "confirmed",
    },
    hash: {
      type: "text",
      default:
        "0x4e3a3754410177286f09d1ef56f2e60f0a2c02ded21c8c5f6dc0d8e8e0b6f4f3",
    },
    explorer: {
      type: "select",
      options: ["none", "https://etherscan.io", "https://basescan.org"],
      default: "https://etherscan.io",
    },
  })

  return (
    <PreviewLayout controls={entries}>
      <TxStatus
        status={values.status as "confirmed"}
        hash={values.hash}
        explorerUrl={values.explorer === "none" ? undefined : values.explorer}
      />
    </PreviewLayout>
  )
}
