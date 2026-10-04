"use client"

import { Bold, Italic, Underline } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ToggleGroupPreview() {
  const { values, entries } = useControls({
    type: { type: "select", options: ["single", "multiple"], default: "single" },
    variant: {
      type: "select",
      options: ["default", "outline", "pill", "chip"],
      default: "default",
    },
    size: { type: "select", options: ["sm", "default", "lg"], default: "default" },
    disabled: { type: "boolean", default: false },
  })

  const segment = values.variant === "pill" || values.variant === "chip"
  const statusItems = ["Active", "Passed", "Closed", "All"].map((label) => (
    <ToggleGroupItem key={label} value={label.toLowerCase()}>
      {label}
    </ToggleGroupItem>
  ))

  return (
    <PreviewLayout controls={entries}>
      {segment ? (
        values.type === "single" ? (
          <ToggleGroup
            type="single"
            variant={values.variant as "pill"}
            size={values.size as "default"}
            disabled={values.disabled}
            defaultValue="active"
            aria-label="Proposal status"
          >
            {statusItems}
          </ToggleGroup>
        ) : (
          <ToggleGroup
            type="multiple"
            variant={values.variant as "chip"}
            size={values.size as "default"}
            disabled={values.disabled}
            defaultValue={["active"]}
            aria-label="Proposal status"
          >
            {statusItems}
          </ToggleGroup>
        )
      ) : (
        <ToggleGroup
          type={values.type as "single"}
          variant={values.variant as "default"}
          size={values.size as "default"}
          disabled={values.disabled}
          aria-label="Text style"
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}
    </PreviewLayout>
  )
}
