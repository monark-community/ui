"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const TAGS = Array.from({ length: 30 }).map((_, i) => `Tag #${i + 1}`)

export function ScrollAreaPreview() {
  return (
    <PreviewLayout>
      <ScrollArea className="h-64 w-56 rounded-md border">
        <div className="p-4">
          <h4 className="mb-3 text-sm font-medium leading-none">Tags</h4>
          {TAGS.map((tag) => (
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
