"use client"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ThemeTogglePreview() {
  const { values, entries } = useControls({
    label: { type: "text", default: "Toggle theme" },
    variant: {
      type: "select",
      options: ["ghost", "outline", "secondary"],
      default: "ghost",
    },
    disabled: { type: "boolean", default: false },
  })

  // The docs site runs next-themes too, so this toggles the whole page.
  return (
    <PreviewLayout controls={entries}>
      <ThemeToggle
        label={values.label}
        variant={values.variant as "ghost"}
        disabled={values.disabled}
      />
    </PreviewLayout>
  )
}
