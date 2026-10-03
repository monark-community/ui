"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { CalendarDays, Smile, CreditCard, User, Settings } from "lucide-react"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function CommandPreview() {
  const { values, entries } = useControls({
    placeholder: { type: "text", default: "Type a command or search..." },
    emptyText: { type: "text", default: "No results found." },
    showSettings: { type: "boolean", default: true },
    showShortcuts: { type: "boolean", default: false },
    disabledItem: { type: "boolean", default: false },
  })

  return (
    <PreviewLayout controls={entries}>
      <Command className="rounded-lg border shadow-md w-80">
        <CommandInput placeholder={values.placeholder} />
        <CommandList>
          <CommandEmpty>{values.emptyText}</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarDays className="mr-2 size-4" />
              Calendar
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 size-4" />
              Search Emoji
            </CommandItem>
            <CommandItem disabled={values.disabledItem}>
              <CreditCard className="mr-2 size-4" />
              Billing
              {values.showShortcuts && <CommandShortcut>⌘B</CommandShortcut>}
            </CommandItem>
          </CommandGroup>
          {values.showSettings && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <User className="mr-2 size-4" />
                  Profile
                  {values.showShortcuts && <CommandShortcut>⌘P</CommandShortcut>}
                </CommandItem>
                <CommandItem>
                  <Settings className="mr-2 size-4" />
                  Settings
                  {values.showShortcuts && <CommandShortcut>⌘S</CommandShortcut>}
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </PreviewLayout>
  )
}
