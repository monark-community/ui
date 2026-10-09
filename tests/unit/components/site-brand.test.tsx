import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MonarkLogo, MonarkMark, SiteBrand } from "@/components/ui/site-brand"

describe("SiteBrand", () => {
  it("links home with the product name and the default accessible label", () => {
    render(<SiteBrand name="Acme" />)
    const link = screen.getByRole("link", { name: "Acme, by Monark: home" })
    expect(link).toHaveAttribute("href", "/")
    expect(link).toHaveTextContent("Acme")
  })

  it("does not render 'by Monark' as visible text", () => {
    render(<SiteBrand name="Acme" />)
    expect(screen.queryByText(/by Monark/)).toBeNull()
  })

  it("accepts a custom href and a translated aria-label", () => {
    render(<SiteBrand name="Acme" href="/fr" aria-label="Acme, par Monark : accueil" />)
    const link = screen.getByRole("link", { name: "Acme, par Monark : accueil" })
    expect(link).toHaveAttribute("href", "/fr")
  })

  it("renders through a custom LinkComponent", () => {
    function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
      return <a data-custom="yes" {...props} />
    }
    render(<SiteBrand name="Acme" LinkComponent={CustomLink} />)
    expect(screen.getByRole("link")).toHaveAttribute("data-custom", "yes")
  })

  it("renders the mark as a decorative SVG", () => {
    const { container } = render(<SiteBrand name="Acme" />)
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

describe("MonarkLogo", () => {
  it("is an image named Monark by default", () => {
    render(<MonarkLogo />)
    const logo = screen.getByRole("img", { name: "Monark" })
    expect(logo).toHaveAttribute("data-slot", "monark-logo")
  })

  it("accepts a translated title", () => {
    render(<MonarkLogo title="Logo de Monark" />)
    expect(screen.getByRole("img", { name: "Logo de Monark" })).toBeInTheDocument()
  })

  it("draws the wordmark in currentColor and keeps the butterfly gradient", () => {
    const { container } = render(<MonarkLogo />)
    const paths = Array.from(container.querySelectorAll("path"))
    expect(paths.filter((p) => p.getAttribute("fill") === "currentColor")).toHaveLength(1)
    expect(paths.filter((p) => p.getAttribute("fill")?.startsWith("url(#"))).toHaveLength(3)
    expect(container.querySelector("svg")).toHaveClass("text-foreground")
  })

  it("gives each instance its own gradient ids", () => {
    const { container } = render(
      <>
        <MonarkLogo />
        <MonarkLogo />
      </>
    )
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id)
    expect(ids).toHaveLength(6)
    expect(new Set(ids).size).toBe(6)
    for (const path of Array.from(container.querySelectorAll("path[fill^='url(#']"))) {
      const ref = path.getAttribute("fill")!.slice(5, -1)
      expect(ids).toContain(ref)
    }
  })

  it("merges a custom className", () => {
    const { container } = render(<MonarkLogo className="h-12" />)
    expect(container.querySelector("svg")).toHaveClass("h-12", "w-auto")
  })
})
