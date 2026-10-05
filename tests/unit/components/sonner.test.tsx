import { describe, it, expect, afterEach, beforeAll } from "vitest"
import { act, cleanup, render, screen } from "@testing-library/react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

beforeAll(() => {
  // jsdom has no matchMedia; sonner reads it for the "system" theme.
  if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
  }
})

afterEach(() => {
  act(() => {
    toast.dismiss()
  })
  cleanup()
})

describe("Toaster", () => {
  it("renders a notifications region with the Monark surface tokens", async () => {
    render(<Toaster />)
    act(() => {
      toast("Hello")
    })
    await screen.findByText("Hello")
    // Sonner portals the toaster to document.body.
    const list = document.querySelector("[data-sonner-toaster]") as HTMLElement
    expect(list).not.toBeNull()
    expect(list.style.getPropertyValue("--normal-bg")).toBe("var(--popover)")
    expect(list.style.getPropertyValue("--normal-text")).toBe("var(--popover-foreground)")
    expect(list.style.getPropertyValue("--normal-border")).toBe("var(--border)")
    expect(list.style.fontFamily).toBe("var(--font-sans)")
  })

  it("shows a toast with its title and a muted description", async () => {
    render(<Toaster />)
    act(() => {
      toast("Proposal submitted", { description: "Voting opens Sunday." })
    })
    expect(await screen.findByText("Proposal submitted")).toBeInTheDocument()
    const description = screen.getByText("Voting opens Sunday.")
    expect(description.className).toContain("text-muted-foreground!")
  })

  it("uses the lucide status icon in the semantic colour", async () => {
    render(<Toaster />)
    act(() => {
      toast.success("Saved")
    })
    await screen.findByText("Saved")
    const icon = document.querySelector("[data-icon] svg")
    expect(icon).not.toBeNull()
    expect(icon).toHaveClass("text-success")
  })

  it("renders the action button and runs its handler", async () => {
    let clicked = false
    render(<Toaster />)
    act(() => {
      toast("Removed", { action: { label: "Undo", onClick: () => (clicked = true) } })
    })
    const button = await screen.findByRole("button", { name: "Undo" })
    act(() => button.click())
    expect(clicked).toBe(true)
  })

  it("lets consumers add toast classNames without losing the defaults", async () => {
    render(<Toaster toastOptions={{ classNames: { title: "custom-title" } }} />)
    act(() => {
      toast("Merged", { description: "Still muted" })
    })
    expect(await screen.findByText("Merged")).toHaveClass("custom-title")
    expect(screen.getByText("Still muted").className).toContain("text-muted-foreground!")
  })
})
