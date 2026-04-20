"use client"

import { NetworkBadge } from "@/components/ui/network-badge"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const CHAINS = {
  Ethereum: { color: "#627eea", initial: "E" },
  Base: { color: "#0052ff", initial: "B" },
  Arbitrum: { color: "#28a0f0", initial: "A" },
  Optimism: { color: "#ff0420", initial: "O" },
  Polygon: { color: "#8247e5", initial: "P" },
} as const

function ChainDot({ color, initial }: { color: string; initial: string }) {
  return (
    <span
      className="flex size-full items-center justify-center text-[0.6rem] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initial}
    </span>
  )
}

export function NetworkBadgePreview() {
  const { values, entries } = useControls({
    name: {
      type: "select",
      options: Object.keys(CHAINS),
      default: "Base",
    },
    variant: {
      type: "select",
      options: ["default", "outline", "subtle"],
      default: "default",
    },
    showIcon: { type: "boolean", default: true },
  })

  const chain = CHAINS[values.name as keyof typeof CHAINS]

  return (
    <PreviewLayout controls={entries}>
      <NetworkBadge
        name={values.name}
        variant={values.variant as "default"}
        icon={
          values.showIcon ? (
            <ChainDot color={chain.color} initial={chain.initial} />
          ) : undefined
        }
      />
    </PreviewLayout>
  )
}
