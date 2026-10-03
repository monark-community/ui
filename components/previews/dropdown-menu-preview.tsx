"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function DropdownMenuPreview() {
  const { values, entries } = useControls({
    triggerLabel: { type: "text", default: "Open Menu" },
    align: { type: "select", options: ["center", "start", "end"], default: "center" },
  })

  return (
    <PreviewLayout controls={entries}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{values.triggerLabel}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={values.align as "center"}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PreviewLayout>
  )
}
