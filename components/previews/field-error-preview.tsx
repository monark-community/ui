"use client"

import { FieldError } from "@/components/ui/field-error"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function FieldErrorPreview() {
  const { values, entries } = useControls({
    message: { type: "text", default: "Enter a valid 0x address" },
    showIcon: { type: "boolean", default: true },
    reserveSpace: { type: "boolean", default: true },
  })

  const error = values.message.trim()

  return (
    <PreviewLayout controls={entries}>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <Label htmlFor="field-error-address">Wallet address</Label>
        <Input
          id="field-error-address"
          defaultValue="0x12ab"
          aria-invalid={error ? true : undefined}
          aria-describedby={error || values.reserveSpace ? "field-error-address-error" : undefined}
          className="font-mono"
        />
        <FieldError
          id="field-error-address-error"
          icon={values.showIcon ? undefined : false}
          reserveSpace={values.reserveSpace}
        >
          {error}
        </FieldError>
      </div>
    </PreviewLayout>
  )
}
