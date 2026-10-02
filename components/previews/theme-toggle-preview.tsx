"use client"

import { ThemeToggle } from "@/components/ui/theme-toggle"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ThemeTogglePreview() {
  // The docs site runs next-themes too, so this toggles the whole page.
  return (
    <PreviewLayout>
      <ThemeToggle label="Toggle theme" />
    </PreviewLayout>
  )
}
