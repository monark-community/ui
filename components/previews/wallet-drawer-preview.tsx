"use client"

import { useState } from "react"
import { WalletDrawer } from "@/registry/new-york/blocks/wallet-drawer/wallet-drawer"
import { TokenAmount } from "@/components/ui/token-amount"
import { TxStatus } from "@/components/ui/tx-status"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function WalletDrawerPreview() {
  const { values, entries } = useControls({
    status: {
      type: "select",
      options: ["disconnected", "connecting", "connected"],
      default: "connected",
    },
    name: { type: "text", default: "vitalik.eth" },
    chain: {
      type: "select",
      options: ["Ethereum", "Base", "Arbitrum", "Optimism"],
      default: "Base",
    },
    showTransactions: { type: "boolean", default: true },
  })

  const [open, setOpen] = useState(false)
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

  return (
    <PreviewLayout controls={entries}>
      <WalletDrawer
        status={values.status as "connected"}
        address={address}
        name={values.name || undefined}
        chainName={values.chain}
        open={open}
        onOpenChange={setOpen}
        description="Manage your connected wallet, view recent activity, or disconnect."
        balance={
          <TokenAmount
            value={1_234_560_000_000_000_000n}
            decimals={18}
            symbol="ETH"
            usdValue={3456.78}
          />
        }
        transactions={
          values.showTransactions ? (
            <>
              <TxStatus
                status="confirmed"
                hash="0x4e3a3754410177286f09d1ef56f2e60f0a2c02ded21c8c5f6dc0d8e8e0b6f4f3"
                explorerUrl="https://etherscan.io"
              />
              <TxStatus
                status="pending"
                hash="0x9b2c7d8e4f5a1b3c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c"
              />
            </>
          ) : undefined
        }
        onConnect={() => setOpen(true)}
        onDisconnect={() => setOpen(false)}
      />
    </PreviewLayout>
  )
}
