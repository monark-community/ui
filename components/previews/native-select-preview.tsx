"use client"

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function NativeSelectPreview() {
  const { values, entries } = useControls({
    size: { type: "select", options: ["sm", "default"], default: "default" },
    disabled: { type: "boolean", default: false },
    invalid: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="native-select-period">Voting period</Label>
        <NativeSelect
          id="native-select-period"
          size={values.size as "default"}
          disabled={values.disabled}
          aria-invalid={values.invalid || undefined}
          defaultValue="7"
          className="w-48"
        >
          <NativeSelectOption value="3">3 days</NativeSelectOption>
          <NativeSelectOption value="7">7 days</NativeSelectOption>
          <NativeSelectOption value="14">14 days</NativeSelectOption>
          <NativeSelectOption value="30">30 days</NativeSelectOption>
        </NativeSelect>
      </div>
    </PreviewLayout>
  )
}
