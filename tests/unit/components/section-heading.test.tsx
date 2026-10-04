import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { SectionHeading } from "@/components/ui/section-heading"

describe("SectionHeading", () => {
  it("renders an h2 by default", () => {
    render(<SectionHeading title="Three steps" />)
    expect(screen.getByRole("heading", { level: 2, name: "Three steps" })).toBeInTheDocument()
  })

  it.each([
    ["h1", 1],
    ["h2", 2],
    ["h3", 3],
  ] as const)("renders as=%s at level %i", (as, level) => {
    render(<SectionHeading as={as} title="Title" />)
    expect(screen.getByRole("heading", { level, name: "Title" })).toBeInTheDocument()
  })

  it("keeps the heading level independent of the visual size", () => {
    render(<SectionHeading as="h3" size="lg" title="Big but h3" />)
    const h = screen.getByRole("heading", { level: 3 })
    expect(h).toHaveClass("font-extrabold")
  })

  it("puts the id on the heading for aria-labelledby", () => {
    render(
      <section aria-labelledby="steps-title">
        <SectionHeading titleId="steps-title" title="Steps" />
      </section>
    )
    expect(screen.getByRole("region", { name: "Steps" })).toBeInTheDocument()
  })

  it("renders the eyebrow outside the heading, and the lead", () => {
    render(<SectionHeading eyebrow="How it works" title="Steps" lead="Fund, agree, release." />)
    const heading = screen.getByRole("heading", { name: "Steps" })
    expect(heading).not.toHaveTextContent("How it works")
    expect(screen.getByText("How it works")).toHaveClass("eyebrow", "text-muted-foreground")
    expect(screen.getByText("Fund, agree, release.").tagName).toBe("P")
  })

  it("supports a primary eyebrow tone", () => {
    render(<SectionHeading eyebrow="New" eyebrowTone="primary" title="T" />)
    expect(screen.getByText("New")).toHaveClass("text-primary-ink")
  })

  it("omits eyebrow, lead and action slots when not given", () => {
    const { container } = render(<SectionHeading title="T" />)
    for (const slot of ["section-heading-eyebrow", "section-heading-lead", "section-heading-action"]) {
      expect(container.querySelector(`[data-slot='${slot}']`)).toBeNull()
    }
  })

  it("renders the action slot", () => {
    render(<SectionHeading title="T" action={<a href="/how">See how</a>} />)
    expect(screen.getByRole("link", { name: "See how" }).closest("[data-slot='section-heading-action']")).not.toBeNull()
  })

  it("centres when align=center", () => {
    const { container } = render(<SectionHeading title="T" align="center" />)
    expect(container.querySelector("[data-slot='section-heading']")).toHaveClass("text-center")
  })
})
