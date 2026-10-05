"use client"

import * as React from "react"
import { cn } from "cn"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

export interface NftTrait {
  /** Trait category; e.g. "Background", "Body". */
  type: string
  /** Trait value; e.g. "Blue", "Cosmic". */
  value: string
  /** Optional rarity percentage (0-100) shown beneath the trait value. */
  rarity?: number
}

export interface NftCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** NFT display name. */
  name: string
  /** Image URL for the NFT. */
  image: string
  /** Alt text for the image. Defaults to `name`. */
  imageAlt?: string
  /** Collection name; rendered in muted text above the name. */
  collection?: string
  /** Optional collection badge shown as an overlay in the top-left of the image. */
  collectionBadge?: React.ReactNode
  /** Aspect ratio of the image; defaults to 1 (square). */
  aspectRatio?: number
  /** Price label (e.g. "0.42 ETH"). Rendered in the footer. */
  price?: React.ReactNode
  /** Secondary price label (e.g. "$1,234"). Rendered under `price` in muted text. */
  priceSecondary?: React.ReactNode
  /** Primary action button slot; e.g. <Button>Buy</Button>. */
  action?: React.ReactNode
  /** Trait list. Rendered in a 2-column grid between the header and footer. */
  traits?: NftTrait[]
  /** Cap on the number of traits shown before truncating with "+N more". Default: 4. */
  maxTraits?: number
  /** Text under a trait's value. Default: "12.5% have this". */
  rarityLabel?: (percent: string) => string
  /** Text for the hidden-trait count. Default: "+3 more traits". */
  moreTraitsLabel?: (count: number) => string
}

function NftCard({
  name,
  image,
  imageAlt,
  collection,
  collectionBadge,
  aspectRatio = 1,
  price,
  priceSecondary,
  action,
  traits,
  maxTraits = 4,
  rarityLabel = (percent) => `${percent}% have this`,
  moreTraitsLabel = (count) => `+${count} more trait${count === 1 ? "" : "s"}`,
  className,
  ...props
}: NftCardProps) {
  const visibleTraits = traits?.slice(0, maxTraits) ?? []
  const hiddenTraitCount = traits ? Math.max(0, traits.length - maxTraits) : 0

  return (
    <Card
      data-slot="nft-card"
      size="sm"
      className={cn("w-full max-w-sm pt-0", className)}
      {...props}
    >
      <div className="relative">
        <AspectRatio ratio={aspectRatio}>
          {/* Using a plain <img> instead of next/image so this block works
           *  outside a Next.js context. Consumers in Next apps can swap to
           *  next/image post-paste. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt ?? name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </AspectRatio>
        {collectionBadge && (
          <div className="absolute top-3 left-3">
            {typeof collectionBadge === "string" ? (
              <Badge variant="secondary">{collectionBadge}</Badge>
            ) : (
              collectionBadge
            )}
          </div>
        )}
      </div>

      <CardHeader className="gap-0.5">
        {collection && (
          <p className="truncate text-xs font-semibold text-muted-foreground">
            {collection}
          </p>
        )}
        <h3 className="truncate text-base leading-tight font-extrabold">{name}</h3>
      </CardHeader>

      {visibleTraits.length > 0 && (
        <CardContent className="grid grid-cols-2 gap-2">
          {visibleTraits.map((t, i) => (
            <div
              key={`${t.type}-${i}`}
              className="min-w-0 rounded-xl bg-muted px-3 py-2"
            >
              <p className="truncate text-[0.6875rem] font-bold tracking-wide text-muted-foreground uppercase">
                {t.type}
              </p>
              <p className="truncate text-sm font-bold">{t.value}</p>
              {typeof t.rarity === "number" && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {rarityLabel(t.rarity.toFixed(1))}
                </p>
              )}
            </div>
          ))}
          {hiddenTraitCount > 0 && (
            <div className="col-span-2 text-center text-xs font-semibold text-muted-foreground">
              {moreTraitsLabel(hiddenTraitCount)}
            </div>
          )}
        </CardContent>
      )}

      {(price || action) && (
        <CardFooter className="justify-between gap-3">
          {price && (
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tabular-nums">{price}</span>
              {priceSecondary && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {priceSecondary}
                </span>
              )}
            </div>
          )}
          {action && <div className="ml-auto">{action}</div>}
        </CardFooter>
      )}
    </Card>
  )
}

export { NftCard }
