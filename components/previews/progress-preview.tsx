"use client"

import { Progress } from "@/components/ui/progress"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ProgressPreview() {
  const { values, entries } = useControls({
    value: {
      type: "select",
      options: ["0", "25", "50", "75", "100"],
      default: "50",
    },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="w-full min-w-80 md:min-w-md lg:min-w-lg space-y-2">
        <Progress value={parseInt(values.value, 10)} />
        <div className="text-xs text-muted-foreground text-right">{values.value}%</div>
      </div>
    </PreviewLayout>
  )
}
