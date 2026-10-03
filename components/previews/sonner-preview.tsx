"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function SonnerPreview() {
  const { values, entries } = useControls({
    type: {
      type: "select",
      options: ["default", "success", "info", "warning", "error"],
      default: "default",
    },
    message: { type: "text", default: "Event has been created" },
    description: { type: "text", default: "Sunday, December 03, 2024 at 9:00 AM" },
    action: { type: "boolean", default: false },
  })

  const show = () => {
    const options = {
      description: values.description || undefined,
      action: values.action
        ? { label: "Undo", onClick: () => toast("Change undone") }
        : undefined,
    }
    if (values.type === "default") toast(values.message, options)
    else toast[values.type as "success" | "info" | "warning" | "error"](values.message, options)
  }

  return (
    <PreviewLayout controls={entries}>
      <Button variant="outline" onClick={show}>
        Show Toast
      </Button>
    </PreviewLayout>
  )
}
