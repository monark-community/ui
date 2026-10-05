"use client"

import { useEffect, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SliderPreview() {
  const { values, entries } = useControls({
    mode: { type: "select", options: ["single", "range"], default: "single" },
    step: { type: "select", options: ["1", "5", "10"], default: "1" },
    max: { type: "select", options: ["50", "100", "200"], default: "100" },
    disabled: { type: "boolean", default: false },
  })

  const max = parseInt(values.max, 10)
  const isRange = values.mode === "range"
  const [value, setValue] = useState<number[]>([Math.round(max / 2)])

  // Reset to a sensible value whenever the mode or the scale changes.
  useEffect(() => {
    setValue(
      isRange
        ? [Math.round(max * 0.25), Math.round(max * 0.75)]
        : [Math.round(max / 2)]
    )
  }, [isRange, max])

  return (
    <PreviewLayout controls={entries}>
      <div className="w-[min(24rem,calc(100vw-4rem))] space-y-2">
        <Slider
          value={value}
          onValueChange={setValue}
          max={max}
          step={parseInt(values.step, 10)}
          disabled={values.disabled}
          thumbLabel={
            isRange ? (i) => (i === 0 ? "Minimum" : "Maximum") : "Volume"
          }
        />
        <div className="text-right text-xs text-muted-foreground tabular-nums">
          {isRange ? `${value[0]} – ${value[1]}` : value[0]} / {max}
        </div>
      </div>
    </PreviewLayout>
  )
}
