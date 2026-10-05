import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function Faq({ variant }: { variant?: "default" | "plus" }) {
  return (
    <Accordion type="single" collapsible variant={variant}>
      <AccordionItem value="a">
        <AccordionTrigger>What is Monark?</AccordionTrigger>
        <AccordionContent>
          <p>
            An ecosystem. See <a href="https://github.com/monark-community">GitHub</a>.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Is it open source?</AccordionTrigger>
        <AccordionContent>Yes.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("toggles a panel and keeps the icons out of the name", async () => {
    const user = userEvent.setup()
    render(<Faq />)
    const trigger = screen.getByRole("button", { name: "What is Monark?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("region")).toHaveTextContent("An ecosystem.")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("animates the panel with animate-expand", async () => {
    const user = userEvent.setup()
    render(<Faq />)
    await user.click(screen.getByRole("button", { name: "What is Monark?" }))
    const content = screen.getByRole("region")
    expect(content).toHaveAttribute("data-slot", "accordion-content")
    expect(content).toHaveClass("animate-expand")
    expect(content).toHaveAttribute("data-state", "open")
  })

  it("keeps the default variant's chevrons and hairlines", () => {
    const { container } = render(<Faq />)
    const item = container.querySelector("[data-slot='accordion-item']")
    expect(item).toHaveClass("not-last:border-b")
    expect(
      container.querySelectorAll("[data-slot='accordion-trigger-icon']")
    ).toHaveLength(4)
    expect(screen.getByRole("button", { name: "What is Monark?" })).toHaveClass(
      "text-sm",
      "font-medium",
      "hover:underline"
    )
  })

  it("renders the plus variant like the monark.io FAQ", async () => {
    const user = userEvent.setup()
    const { container } = render(<Faq variant="plus" />)
    expect(container.querySelector("[data-slot='accordion']")).toHaveAttribute(
      "data-variant",
      "plus"
    )
    expect(container.querySelector("[data-slot='accordion-item']")).toHaveClass(
      "border-b",
      "last:border-b-0"
    )

    const trigger = screen.getByRole("button", { name: "What is Monark?" })
    expect(trigger).toHaveClass(
      "min-h-14",
      "py-3",
      "text-lg",
      "leading-snug",
      "font-bold",
      "[text-wrap:pretty]",
      "transition-colors",
      "duration-150",
      "hover:text-primary-ink",
      "focus-visible:ring-3",
      "focus-visible:ring-ring/50"
    )
    expect(trigger).not.toHaveClass("border", "border-transparent")

    const icons = trigger.querySelectorAll("[data-slot='accordion-trigger-icon']")
    expect(icons).toHaveLength(1)
    expect(icons[0]).toHaveAttribute("aria-hidden", "true")
    expect(icons[0]).toHaveClass(
      "text-primary",
      "ease-out",
      "group-data-[state=open]/accordion-trigger:rotate-45"
    )

    await user.click(trigger)
    const content = screen.getByRole("region")
    expect(content).toHaveClass("animate-expand", "text-base", "text-muted-foreground")
    expect(content.firstElementChild).toHaveClass(
      "max-w-[68ch]",
      "pb-5",
      "leading-relaxed",
      "[&_a]:text-primary-ink",
      "[&_a:hover]:text-foreground"
    )
  })
})
