"use client"

import {
  Stat,
  StatDelta,
  StatGroup,
  StatHint,
  StatLabel,
  StatValue,
} from "@/components/ui/stat"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function StatPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Total value locked" },
    value: { type: "text", default: "$1,284,920" },
    hint: { type: "text", default: "Across 12 pools" },
    showDelta: { type: "boolean", default: true },
    delta: { type: "text", default: "+4.2%" },
    trend: { type: "select", options: ["up", "down", "flat"], default: "up" },
    variant: { type: "select", options: ["tile", "plain"], default: "tile" },
    tone: {
      type: "select",
      options: ["default", "primary", "success", "warning", "destructive"],
      default: "default",
    },
    size: { type: "select", options: ["sm", "default", "lg"], default: "default" },
  })

  return (
    <PreviewLayout controls={entries}>
      <StatGroup className="w-full max-w-2xl sm:grid-cols-2 lg:grid-cols-2">
        <Stat
          variant={values.variant as "tile"}
          tone={values.tone as "default"}
          size={values.size as "default"}
        >
          <StatLabel>{values.label}</StatLabel>
          <StatValue>{values.value}</StatValue>
          {values.showDelta ? (
            <StatDelta trend={values.trend as "up"} srLabel="Change this week:">
              {values.delta}
            </StatDelta>
          ) : null}
          {values.hint ? <StatHint>{values.hint}</StatHint> : null}
        </Stat>
        <Stat variant={values.variant as "tile"} size={values.size as "default"}>
          <StatLabel>Open positions</StatLabel>
          <StatValue>38</StatValue>
          <StatHint>6 near liquidation</StatHint>
        </Stat>
      </StatGroup>
    </PreviewLayout>
  )
}
