"use client"

import { useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function MenubarPreview() {
  const [showBookmarks, setShowBookmarks] = useState(true)
  const [profile, setProfile] = useState("andy")

  const { values, entries } = useControls({
    showShortcuts: { type: "boolean", default: true },
    showCheckboxes: { type: "boolean", default: false },
    showProfiles: { type: "boolean", default: false },
    disableShare: { type: "boolean", default: false },
    inset: { type: "boolean", default: false },
  })

  const shortcut = (keys: string) => (values.showShortcuts ? <MenubarShortcut>{keys}</MenubarShortcut> : null)

  return (
    <PreviewLayout controls={entries}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem inset={values.inset}>New Tab {shortcut("⌘T")}</MenubarItem>
            <MenubarItem inset={values.inset}>New Window {shortcut("⌘N")}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset={values.inset} disabled={values.disableShare}>
              Share
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset={values.inset}>Print… {shortcut("⌘P")}</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem inset={values.inset}>Undo {shortcut("⌘Z")}</MenubarItem>
            <MenubarItem inset={values.inset}>Redo {shortcut("⇧⌘Z")}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset={values.inset}>Find</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            {values.showCheckboxes && (
              <>
                <MenubarCheckboxItem checked={showBookmarks} onCheckedChange={(v) => setShowBookmarks(v === true)}>
                  Always Show Bookmarks Bar
                </MenubarCheckboxItem>
                <MenubarCheckboxItem checked disabled>
                  Always Show Full URLs
                </MenubarCheckboxItem>
                <MenubarSeparator />
              </>
            )}
            <MenubarItem inset={values.inset}>Toggle Sidebar</MenubarItem>
            <MenubarItem inset={values.inset}>Reload</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {values.showProfiles && (
          <MenubarMenu>
            <MenubarTrigger>Profiles</MenubarTrigger>
            <MenubarContent>
              <MenubarRadioGroup value={profile} onValueChange={setProfile}>
                <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        )}
      </Menubar>
    </PreviewLayout>
  )
}
