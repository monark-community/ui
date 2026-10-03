"use client"

import { useState } from "react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ContextMenuPreview() {
  const [showBookmarks, setShowBookmarks] = useState(true)
  const [person, setPerson] = useState("pedro")

  const { values, entries } = useControls({
    showShortcuts: { type: "boolean", default: false },
    showCheckboxes: { type: "boolean", default: false },
    showRadioGroup: { type: "boolean", default: false },
    disableForward: { type: "boolean", default: false },
    inset: { type: "boolean", default: false },
  })

  const shortcut = (keys: string) => (values.showShortcuts ? <ContextMenuShortcut>{keys}</ContextMenuShortcut> : null)

  return (
    <PreviewLayout controls={entries}>
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className={values.showShortcuts ? "w-56" : undefined}>
          <ContextMenuItem inset={values.inset}>Back{shortcut("⌘[")}</ContextMenuItem>
          <ContextMenuItem inset={values.inset} disabled={values.disableForward}>
            Forward{shortcut("⌘]")}
          </ContextMenuItem>
          <ContextMenuItem inset={values.inset}>Reload{shortcut("⌘R")}</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem inset={values.inset}>View Source{shortcut("⌥⌘U")}</ContextMenuItem>
          {values.showCheckboxes && (
            <>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem checked={showBookmarks} onCheckedChange={(v) => setShowBookmarks(v === true)}>
                Show Bookmarks
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem checked disabled>
                Show Full URLs
              </ContextMenuCheckboxItem>
            </>
          )}
          {values.showRadioGroup && (
            <>
              <ContextMenuSeparator />
              <ContextMenuLabel inset>People</ContextMenuLabel>
              <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
                <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
                <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </PreviewLayout>
  )
}
