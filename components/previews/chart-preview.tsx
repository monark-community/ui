"use client"

import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"
import {
  CHART_TYPES,
  ChartExample,
  type ChartType,
  type TooltipIndicator,
} from "./chart/chart-examples"

export function ChartPreview() {
  const { values, entries } = useControls({
    type: { type: "select", options: [...CHART_TYPES], default: "bar" },
    indicator: { type: "select", options: ["dot", "line", "dashed"], default: "dot" },
    legend: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <ChartExample
        type={values.type as ChartType}
        indicator={values.indicator as TooltipIndicator}
        legend={values.legend}
      />
    </PreviewLayout>
  )
}
