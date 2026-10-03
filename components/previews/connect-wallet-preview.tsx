"use client"

import { useState } from "react"
import { ConnectWallet } from "@/components/ui/connect-wallet"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ConnectWalletPreview() {
  const { values, entries } = useControls({
    status: {
      type: "select",
      options: ["disconnected", "connecting", "connected"],
      default: "connected",
    },
    address: {
      type: "text",
      default: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    },
    name: { type: "text", default: "vitalik.eth" },
    variant: {
      type: "select",
      options: ["default", "secondary", "outline", "ghost"],
      default: "default",
    },
    size: { type: "select", options: ["default", "sm", "lg"], default: "default" },
    connectLabel: { type: "text", default: "Connect wallet" },
    connectingLabel: { type: "text", default: "Connecting…" },
    disconnectLabel: { type: "text", default: "Disconnect" },
  })

  const [lastAction, setLastAction] = useState<string | null>(null)

  return (
    <PreviewLayout controls={entries}>
      <div className="flex flex-col items-center gap-3">
        <ConnectWallet
          status={values.status as "connected"}
          address={values.address || undefined}
          name={values.name || undefined}
          variant={values.variant as "default"}
          size={values.size as "default"}
          connectLabel={values.connectLabel || undefined}
          connectingLabel={values.connectingLabel || undefined}
          disconnectLabel={values.disconnectLabel || undefined}
          onConnect={() => setLastAction("onConnect fired")}
          onDisconnect={() => setLastAction("onDisconnect fired")}
        />
        {lastAction && (
          <p className="text-xs text-muted-foreground">{lastAction}</p>
        )}
      </div>
    </PreviewLayout>
  )
}
