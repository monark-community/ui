"use client"

import { RoleChip } from "@/components/ui/role-chip"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const colors: Record<string, string | undefined> = {
  none: undefined,
  orange: "#f88d10",
  red: "#ef3620",
  green: "#2f7a4a",
  blue: "#3b82f6",
  violet: "#8b5cf6",
}

export function RoleChipPreview() {
  const { values, entries } = useControls({
    name: { type: "text", default: "Treasurer" },
    color: {
      type: "select",
      options: ["none", "orange", "red", "green", "blue", "violet"],
      default: "orange",
    },
    removable: { type: "boolean", default: true },
    removeDisabled: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <div className="flex flex-wrap items-center gap-2">
        <RoleChip
          name={values.name}
          color={colors[values.color]}
          onRemove={values.removable ? () => {} : undefined}
          removeDisabled={values.removeDisabled}
        />
        <RoleChip name="Member" color="#3b82f6" />
        <RoleChip name="Observer" />
      </div>
    </PreviewLayout>
  )
}
