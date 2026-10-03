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
    collectionBadge: { type: "text", default: "Genesis" },
    aspectRatio: {
      type: "select",
      options: ["1:1", "4:3", "3:4", "16:9"],
      default: "1:1",
    },
    showTraits: { type: "boolean", default: true },
    maxTraits: { type: "number", default: 4, min: 1, max: 4 },
    showPrice: { type: "boolean", default: true },
    price: { type: "text", default: "0.42 ETH" },
    priceSecondary: { type: "text", default: "$1,234" },
  })

  const [w, h] = values.aspectRatio.split(":").map(Number)

  return (
    <PreviewLayout controls={entries}>
      <NftCard
        name={values.name || "Unnamed"}
        collection={values.collection || undefined}
        collectionBadge={values.collectionBadge || undefined}
        aspectRatio={w / h}
        maxTraits={values.maxTraits}
        image={SAMPLE_IMAGE}
        price={values.showPrice ? values.price || undefined : undefined}
        priceSecondary={values.showPrice ? values.priceSecondary || undefined : undefined}
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
