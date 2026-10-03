"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function PopoverPreview() {
  const { values, entries } = useControls({
    content: { type: "text", default: "This is a popover. It can contain any content." },
    side: { type: "select", options: ["bottom", "top", "left", "right"], default: "bottom" },
    align: { type: "select", options: ["center", "start", "end"], default: "center" },
  })

  return (
    <PreviewLayout controls={entries}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Popover</Button>
        </PopoverTrigger>
        <PopoverContent
          side={values.side as "bottom"}
          align={values.align as "center"}
          className="w-64"
        >
          <p className="text-sm">{values.content}</p>
        </PopoverContent>
      </Popover>
    </PreviewLayout>
  )
}
