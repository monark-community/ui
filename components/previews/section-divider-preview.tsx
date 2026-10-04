"use client"

import { SectionDivider } from "@/components/ui/section-divider"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SectionDividerPreview() {
  const { values, entries } = useControls({
    orientation: {
      type: "select",
      options: ["horizontal", "vertical"],
      default: "horizontal",
    },
    ends: { type: "select", options: ["both", "start", "end", "none"], default: "both" },
    contained: { type: "boolean", default: false },
  })

  const vertical = values.orientation === "vertical"

  return (
    <PreviewLayout controls={entries}>
      <div className={vertical ? "flex h-40 items-stretch" : "w-[min(42rem,calc(100vw-4rem))]"}>
        <SectionDivider
          orientation={values.orientation as "horizontal"}
          ends={values.ends as "both"}
          contained={values.contained}
        />
      </div>
    </PreviewLayout>
  )
}
