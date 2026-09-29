"use client"

import { SiteBrand } from "@/components/ui/site-brand"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SiteBrandPreview() {
  const { values, entries } = useControls({
    name: { type: "text", default: "Splitflow" },
  })

  return (
    <PreviewLayout controls={entries}>
      <SiteBrand
        name={values.name || "Splitflow"}
        href="#"
        onClick={(event) => event.preventDefault()}
      />
    </PreviewLayout>
  )
}
