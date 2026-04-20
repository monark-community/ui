"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function AlertDialogPreview() {
  const { values, entries } = useControls({
    triggerLabel: { type: "text", default: "Delete account" },
    title: { type: "text", default: "Are you absolutely sure?" },
    description: {
      type: "text",
      default:
        "This action cannot be undone. Your account and data will be permanently removed.",
    },
  })

  return (
    <PreviewLayout controls={entries}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">{values.triggerLabel}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{values.title}</AlertDialogTitle>
            <AlertDialogDescription>{values.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PreviewLayout>
  )
}
