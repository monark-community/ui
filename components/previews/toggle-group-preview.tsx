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
      options: ["default", "outline"],
      default: "default",
    },
    size: { type: "select", options: ["sm", "default", "lg"], default: "default" },
  })

  return (
    <PreviewLayout controls={entries}>
      <ToggleGroup
        type={values.type as "single"}
        variant={values.variant as "default"}
        size={values.size as "default"}
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
    </PreviewLayout>
  )
}
