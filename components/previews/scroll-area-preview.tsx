"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const ARTWORKS = [
  "Ornella Binni",
  "Tom Byrom",
  "Vladimir Malyavko",
  "Mika Baumeister",
  "Jakob Owens",
  "Pawel Czerwinski",
]

export function ScrollAreaPreview() {
  const { values, entries } = useControls({
    orientation: {
      type: "select",
      options: ["vertical", "horizontal"],
      default: "vertical",
    },
    items: { type: "number", default: 30, min: 5, max: 100 },
  })

  if (values.orientation === "horizontal") {
    return (
      <PreviewLayout controls={entries}>
        <ScrollArea className="w-80 whitespace-nowrap rounded-md border">
          <div className="flex w-max gap-4 p-4">
            {Array.from({ length: values.items }, (_, i) => (
              <figure key={i} className="shrink-0">
                <div className="flex h-32 w-28 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                  #{i + 1}
                </div>
                <figcaption className="pt-2 text-xs text-muted-foreground">
                  {ARTWORKS[i % ARTWORKS.length]}
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </PreviewLayout>
    )
  }

  return (
    <PreviewLayout controls={entries}>
      <ScrollArea className="h-64 w-56 rounded-md border">
        <div className="p-4">
          <h4 className="mb-3 text-sm font-medium leading-none">Tags</h4>
          {Array.from({ length: values.items }, (_, i) => `Tag #${i + 1}`).map((tag) => (
            <div key={tag}>
              <div className="text-sm py-1">{tag}</div>
              <Separator className="my-1" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </PreviewLayout>
  )
}
