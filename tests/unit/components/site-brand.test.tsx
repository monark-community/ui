import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MonarkMark, SiteBrand } from "@/components/ui/site-brand"

describe("SiteBrand", () => {
  it("links home with the product name and the default accessible label", () => {
    render(<SiteBrand name="Splitflow" />)
    const link = screen.getByRole("link", { name: "Splitflow, by Monark: home" })
    expect(link).toHaveAttribute("href", "/")
    expect(link).toHaveTextContent("Splitflow")
  })

  it("does not render 'by Monark' as visible text", () => {
    render(<SiteBrand name="Splitflow" />)
    expect(screen.queryByText(/by Monark/)).toBeNull()
  })

  it("accepts a custom href and a translated aria-label", () => {
    render(<SiteBrand name="Splitflow" href="/fr" aria-label="Splitflow, par Monark : accueil" />)
    const link = screen.getByRole("link", { name: "Splitflow, par Monark : accueil" })
    expect(link).toHaveAttribute("href", "/fr")
  })

  it("renders through a custom LinkComponent", () => {
    function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
      return <a data-custom="yes" {...props} />
    }
    render(<SiteBrand name="Splitflow" LinkComponent={CustomLink} />)
    expect(screen.getByRole("link")).toHaveAttribute("data-custom", "yes")
  })

  it("renders the mark as a decorative SVG", () => {
    const { container } = render(<SiteBrand name="Splitflow" />)
    const svg = container.querySelector("[data-slot='monark-mark']")
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })
})

describe("MonarkMark", () => {
  it("gives each instance its own gradient ids", () => {
    const { container } = render(
      <>
        <MonarkMark />
        <MonarkMark />
      </>
    )
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id)
    expect(ids).toHaveLength(6)
    expect(new Set(ids).size).toBe(6)
  })

  it("becomes an image with a title when one is given", () => {
    render(<MonarkMark title="Monark" />)
    expect(screen.getByRole("img", { name: "Monark" })).toBeInTheDocument()
  })
})
