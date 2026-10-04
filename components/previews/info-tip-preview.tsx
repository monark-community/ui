"use client"

import { InfoTip } from "@/components/ui/info-tip"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function InfoTipPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "How the fee works" },
    content: {
      type: "text",
      default: "A flat 0.3% goes to liquidity providers. Nothing goes to Monark.",
    },
    side: {
      type: "select",
      options: ["top", "right", "bottom", "left"],
      default: "bottom",
    },
    align: { type: "select", options: ["start", "center", "end"], default: "center" },
  })

  return (
    <PreviewLayout controls={entries}>
      <p className="flex items-center gap-1 text-sm font-semibold">
        Swap fee
        <InfoTip
          label={values.label || undefined}
          side={values.side as "bottom"}
          align={values.align as "center"}
        >
          {values.content}
        </InfoTip>
      </p>
    </PreviewLayout>
  )
}
