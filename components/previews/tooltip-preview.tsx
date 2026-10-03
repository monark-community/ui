"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function TooltipPreview() {
  const { values, entries } = useControls({
    content: { type: "text", default: "This is a tooltip" },
    side: {
      type: "select",
      options: ["top", "right", "bottom", "left"],
      default: "top",
    },
    delayDuration: { type: "number", default: 700, min: 0, max: 2000 },
  })

  return (
    <PreviewLayout controls={entries}>
      <TooltipProvider delayDuration={values.delayDuration}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent side={values.side as "top"}>
            <p>{values.content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </PreviewLayout>
  )
}
