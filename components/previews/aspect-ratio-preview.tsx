"use client"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const RATIOS: Record<string, number> = {
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "1:1": 1,
  "3:4": 3 / 4,
  "9:16": 9 / 16,
}

export function AspectRatioPreview() {
  const { values, entries } = useControls({
    ratio: { type: "select", options: Object.keys(RATIOS), default: "16:9" },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="w-full max-w-sm">
        <AspectRatio ratio={RATIOS[values.ratio]} className="bg-muted rounded-md">
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            {values.ratio}
          </div>
        </AspectRatio>
      </div>
    </PreviewLayout>
  )
}
