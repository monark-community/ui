"use client"

import { AppLoading } from "@/components/ui/app-loading"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function AppLoadingPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Loading the demo…" },
    stats: { type: "number", default: 4, min: 0, max: 4 },
    panels: { type: "number", default: 2, min: 0, max: 4 },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="w-[calc(100vw-2rem)] max-w-6xl rounded-xl border bg-background px-4 py-6 sm:px-6">
        <AppLoading label={values.label || undefined} stats={values.stats} panels={values.panels} />
      </div>
    </PreviewLayout>
  )
}
