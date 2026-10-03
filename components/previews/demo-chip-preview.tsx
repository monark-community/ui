"use client"

import { DemoChip } from "@/components/ui/demo-chip"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function DemoChipPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Demo" },
    title: { type: "text", default: "Demo · simulated data" },
  })

  return (
    <PreviewLayout controls={entries}>
      <DemoChip label={values.label || "Demo"} title={values.title || undefined} />
    </PreviewLayout>
  )
}
