"use client"

import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function CollapsiblePreview() {
  const { values, entries } = useControls({
    disabled: { type: "boolean", default: false },
    defaultOpen: { type: "boolean", default: false },
  })
  const [open, setOpen] = useState(values.defaultOpen)
  const [lastDefault, setLastDefault] = useState(values.defaultOpen)
  if (lastDefault !== values.defaultOpen) {
    setLastDefault(values.defaultOpen)
    setOpen(values.defaultOpen)
  }

  return (
    <PreviewLayout controls={entries}>
      {/* The preview canvas shrink-wraps its child, so give the list an
          explicit width. CollapsibleContent animates its height
          (animate-expand); the spacing sits on an inner div so the
          animation starts from 0 without a jump. */}
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        disabled={values.disabled}
        className="w-[min(22rem,calc(100vw-4rem))]"
      >
        <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-2">
          <span className="text-sm font-semibold">
            @monark-community starred 3 repositories
          </span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <ChevronsUpDown className="size-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="mt-2 rounded-md border px-4 py-2 font-mono text-sm">
          monark-community/ui
        </div>
        <CollapsibleContent>
          <div className="space-y-2 pt-2">
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              monark-community/app
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm">
              monark-community/website
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </PreviewLayout>
  )
}
