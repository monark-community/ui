"use client"

import { Wallet } from "@/components/ui/wallet"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function WalletPreview() {
  const { values, entries } = useControls({
    address: {
      type: "text",
      default: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    },
    name: { type: "text", default: "vitalik.eth" },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
    },
    showCopy: { type: "boolean", default: true },
  })

  return (
    <PreviewLayout controls={entries}>
      <Wallet
        address={values.address || "0x0000000000000000000000000000000000000000"}
        name={values.name || undefined}
        size={values.size as "md"}
        showCopy={values.showCopy}
      />
    </PreviewLayout>
  )
}
