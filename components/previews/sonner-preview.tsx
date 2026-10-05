"use client"

import { toast, type ExternalToast, type ToasterProps } from "sonner"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

type ToastType = "default" | "success" | "info" | "warning" | "error" | "loading" | "promise"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export function SonnerPreview() {
  const { values, entries } = useControls({
    type: {
      type: "select",
      options: ["default", "success", "info", "warning", "error", "loading", "promise"],
      default: "default",
    },
    title: { type: "text", default: "Proposal #42 submitted" },
    description: { type: "text", default: "Voting opens Sunday, December 3 at 9:00 AM UTC." },
    action: { type: "boolean", default: true },
    position: {
      type: "select",
      options: ["bottom-right", "bottom-center", "bottom-left", "top-right", "top-center", "top-left"],
      default: "bottom-right",
    },
  })

  const show = () => {
    const title = values.title || "Proposal #42 submitted"
    const options: ExternalToast = {
      description: values.description || undefined,
      action: values.action
        ? { label: "Undo", onClick: () => toast("Submission withdrawn") }
        : undefined,
    }
    const type = values.type as ToastType
    switch (type) {
      case "default":
        toast(title, options)
        break
      case "loading":
        toast.loading(title, options)
        break
      case "promise":
        toast.promise(wait(2000), {
          loading: "Signing transaction…",
          success: title,
          error: "Transaction rejected",
          description: options.description,
          action: options.action,
        })
        break
      default:
        toast[type](title, options)
    }
  }

  return (
    <>
      <PreviewLayout controls={entries}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="outline" onClick={show}>
            Show Toast
          </Button>
          <Button variant="ghost" onClick={() => toast.dismiss()}>
            Dismiss all
          </Button>
        </div>
      </PreviewLayout>
      {/* Outside PreviewLayout: the toaster is `position: fixed`, and the
          preview canvas is a transformed layer that would capture it. */}
      <Toaster position={values.position as ToasterProps["position"]} />
    </>
  )
}
