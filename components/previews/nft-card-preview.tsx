"use client"

import { NftCard } from "@/registry/new-york/blocks/nft-card/nft-card"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const SAMPLE_IMAGE =
  "https://api.dicebear.com/9.x/shapes/svg?seed=monark-nft-42&backgroundType=gradientLinear&backgroundColor=f97316,fb923c"

export function NftCardPreview() {
  const { values, entries } = useControls({
    name: { type: "text", default: "Monark #42" },
    collection: { type: "text", default: "Monark Genesis" },
    showTraits: { type: "boolean", default: true },
    showPrice: { type: "boolean", default: true },
  })

  return (
    <PreviewLayout controls={entries}>
      <NftCard
        name={values.name || "Unnamed"}
        collection={values.collection || undefined}
        collectionBadge="Genesis"
        image={SAMPLE_IMAGE}
        price={values.showPrice ? "0.42 ETH" : undefined}
        priceSecondary={values.showPrice ? "$1,234" : undefined}
        traits={
          values.showTraits
            ? [
                { type: "Background", value: "Cosmic", rarity: 4.2 },
                { type: "Body", value: "Plasma", rarity: 12 },
                { type: "Eyes", value: "Laser", rarity: 1.8 },
                { type: "Aura", value: "Orange Glow", rarity: 8 },
              ]
            : undefined
        }
        action={<Button size="sm">Buy</Button>}
      />
    </PreviewLayout>
  )
}
