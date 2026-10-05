"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SelectPreview() {
  const { values, entries } = useControls({
    placeholder: { type: "text", default: "Select a fruit" },
    position: {
      type: "select",
      options: ["popper", "item-aligned"],
      default: "popper",
    },
    disabled: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <Select disabled={values.disabled}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={values.placeholder} />
        </SelectTrigger>
        <SelectContent position={values.position as "popper"}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectContent>
      </Select>
    </PreviewLayout>
  )
}
