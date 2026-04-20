"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SwitchPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Airplane mode" },
    disabled: { type: "boolean", default: false },
    defaultChecked: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="flex items-center gap-2">
        <Switch
          id="switch-preview"
          disabled={values.disabled}
          defaultChecked={values.defaultChecked}
        />
        <Label htmlFor="switch-preview">{values.label}</Label>
      </div>
    </PreviewLayout>
  )
}
