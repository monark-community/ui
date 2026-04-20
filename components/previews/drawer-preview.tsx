"use client"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function DrawerPreview() {
  const { values, entries } = useControls({
    side: {
      type: "select",
      options: ["bottom", "top", "left", "right"],
      default: "bottom",
    },
    title: { type: "text", default: "Drawer title" },
  })

  return (
    <PreviewLayout controls={entries}>
      <Drawer direction={values.side as "bottom"}>
        <DrawerTrigger asChild>
          <Button variant="outline">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>{values.title}</DrawerTitle>
              <DrawerDescription>
                Slides in from the {values.side}. Tap outside to dismiss.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Confirm</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </PreviewLayout>
  )
}
