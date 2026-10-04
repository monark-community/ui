"use client"

import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function InputGroupPreview() {
  const { values, entries } = useControls({
    placeholder: { type: "text", default: "0.00" },
    suffix: { type: "text", default: "USDC" },
    withButton: { type: "boolean", default: true },
    disabled: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon aria-hidden />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search projects" aria-label="Search projects" disabled={values.disabled} />
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            inputMode="decimal"
            placeholder={values.placeholder}
            aria-label="Amount"
            disabled={values.disabled}
            className="tnum"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{values.suffix}</InputGroupText>
            {values.withButton && (
              <InputGroupButton size="xs" variant="secondary" disabled={values.disabled}>
                Max
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>
    </PreviewLayout>
  )
}
