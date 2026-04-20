"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function ResizablePreview() {
  const { values, entries } = useControls({
    direction: {
      type: "select",
      options: ["horizontal", "vertical"],
      default: "horizontal",
    },
    withHandle: { type: "boolean", default: true },
  })

  return (
    <PreviewLayout controls={entries}>
      <ResizablePanelGroup
        direction={values.direction as "horizontal" | "vertical"}
        className="max-w-md rounded-lg border h-48"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6 text-sm">One</div>
        </ResizablePanel>
        <ResizableHandle withHandle={values.withHandle} />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6 text-sm">Two</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </PreviewLayout>
  )
}
