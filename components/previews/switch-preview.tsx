"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SwitchPreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Airplane mode" },
    size: { type: "select", options: ["sm", "default", "lg"], default: "default" },
    disabled: { type: "boolean", default: false },
    defaultChecked: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="flex items-center gap-2">
        <Switch
          // defaultChecked only applies on mount; remount when it changes.
          key={String(values.defaultChecked)}
          id="switch-preview"
          size={values.size as "default"}
          disabled={values.disabled}
          defaultChecked={values.defaultChecked}
        />
        <Label htmlFor="switch-preview">{values.label}</Label>
      </div>
    </PreviewLayout>
  )
}
