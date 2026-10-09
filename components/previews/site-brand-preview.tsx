"use client"

import { SiteBrand } from "@/components/ui/site-brand"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SiteBrandPreview() {
  const { values, entries } = useControls({
    name: { type: "text", default: "Acme" },
    title: { type: "text", default: "" },
  })

  return (
    <PreviewLayout controls={entries}>
      <SiteBrand
        name={values.name || "Acme"}
        href="#"
        title={values.title || undefined}
        onClick={(event) => event.preventDefault()}
      />
    </PreviewLayout>
  )
}
