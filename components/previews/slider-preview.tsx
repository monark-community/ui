"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SliderPreview() {
  const { values, entries } = useControls({
    step: { type: "select", options: ["1", "5", "10"], default: "1" },
    max: { type: "select", options: ["50", "100", "200"], default: "100" },
    disabled: { type: "boolean", default: false },
  })

  const max = parseInt(values.max, 10)
  const [value, setValue] = useState<number[]>([Math.round(max / 2)])

  return (
    <PreviewLayout controls={entries}>
      <div className="w-full max-w-sm space-y-2">
        <Slider
          value={value}
          onValueChange={setValue}
          max={max}
          step={parseInt(values.step, 10)}
          disabled={values.disabled}
        />
        <div className="text-xs text-muted-foreground text-right">
          {value[0]} / {max}
        </div>
      </div>
    </PreviewLayout>
  )
}
