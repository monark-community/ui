import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function renderDialog(
  variant?: "default" | "destructive",
  actionVariant?: "default" | "outline"
) {
  render(
    <AlertDialog open>
      <AlertDialogContent variant={variant}>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <svg aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant={actionVariant}>Delete account</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
  return screen.getByRole("alertdialog")
}

describe("AlertDialog", () => {
  it("defaults to the default variant with a primary action", () => {
    const dialog = renderDialog()
    expect(dialog).toHaveAttribute("data-variant", "default")
    const action = screen.getByRole("button", { name: "Delete account" })
    expect(action).toHaveAttribute("data-variant", "default")
    expect(action).toHaveClass("bg-primary")
  })

  it("renders a solid red action and red media in a destructive dialog", () => {
    const dialog = renderDialog("destructive")
    expect(dialog).toHaveAttribute("data-variant", "destructive")
    const action = screen.getByRole("button", { name: "Delete account" })
    expect(action).toHaveAttribute("data-variant", "destructive-solid")
    expect(action).toHaveClass("bg-destructive", "text-destructive-foreground")
    expect(dialog.querySelector("[data-slot='alert-dialog-media']")).toHaveClass(
      "group-data-[variant=destructive]/alert-dialog-content:text-destructive"
    )
    // Cancel keeps its outline style.
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute(
      "data-variant",
      "outline"
    )
  })

  it("lets an explicit action variant win inside a destructive dialog", () => {
    renderDialog("destructive", "outline")
    expect(screen.getByRole("button", { name: "Delete account" })).toHaveAttribute(
      "data-variant",
      "outline"
    )
  })

  it("wires the title and description", () => {
    const dialog = renderDialog("destructive")
    expect(dialog).toHaveAccessibleName("Delete your account?")
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.")
  })
})
