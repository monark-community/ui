"use client"

import { Trash2Icon, TriangleAlertIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const EXAMPLES = {
  default: {
    trigger: "Leave without saving",
    title: "Discard unsaved changes?",
    description: "Your edits to this draft will be lost.",
    action: "Discard",
  },
  destructive: {
    trigger: "Delete account",
    title: "Delete your account?",
    description:
      "This action cannot be undone. Your account and data will be permanently removed.",
    action: "Delete account",
  },
} as const

export function AlertDialogPreview() {
  const { values, entries } = useControls({
    variant: {
      type: "select",
      options: ["destructive", "default"],
      default: "destructive",
    },
    size: { type: "select", options: ["default", "sm"], default: "default" },
    media: { type: "boolean", default: true },
  })

  const variant = values.variant as "default" | "destructive"
  const example = EXAMPLES[variant]

  return (
    <PreviewLayout controls={entries}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={variant === "destructive" ? "destructive" : "outline"}>
            {example.trigger}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent variant={variant} size={values.size as "default"}>
          <AlertDialogHeader>
            {values.media ? (
              <AlertDialogMedia>
                {variant === "destructive" ? (
                  <Trash2Icon aria-hidden />
                ) : (
                  <TriangleAlertIcon aria-hidden />
                )}
              </AlertDialogMedia>
            ) : null}
            <AlertDialogTitle>{example.title}</AlertDialogTitle>
            <AlertDialogDescription>{example.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>{example.action}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreviewLayout>
  )
}
