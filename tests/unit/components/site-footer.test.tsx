import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { SiteFooter } from "@/components/ui/site-footer"

function TestLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a data-test-link="" {...props} />
}

function renderFooter(extra: Partial<React.ComponentProps<typeof SiteFooter>> = {}) {
  return render(
    <SiteFooter
      product="Acme"
      description="Wallet history turned into books."
      links={[
        { href: "/en", label: "Overview" },
        { href: "/en/app", label: "Demo" },
      ]}
      resources={[
        { href: "https://example.com/project", label: "Project page" },
        { href: "https://github.com/monark-community/demo-x", label: "Source on GitHub" },
      ]}
      legalLinks={[{ href: "/en/credits", label: "Photo credits" }]}
      copyright="© 2026 Monark · Open source"
      LinkComponent={TestLink}
      {...extra}
    />
  )
}

describe("SiteFooter", () => {
  it("renders a contentinfo landmark with the three bands", () => {
    const { container } = renderFooter()
    const footer = screen.getByRole("contentinfo")
    expect(within(footer).getByText("Acme")).toBeInTheDocument()
    expect(within(footer).getByText("Wallet history turned into books.")).toBeInTheDocument()
    for (const slot of ["site-footer-product", "site-footer-monark", "site-footer-legal"]) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
  })

  it("labels the product links nav and routes internal links through LinkComponent", () => {
    renderFooter()
    const nav = screen.getByRole("navigation", { name: "Site pages" })
    const overview = within(nav).getByRole("link", { name: "Overview" })
    expect(overview).toHaveAttribute("href", "/en")
    expect(overview).toHaveAttribute("data-test-link")
    expect(screen.getByRole("link", { name: "Source on GitHub" })).not.toHaveAttribute("data-test-link")
  })

  it("shows Monark's five socials by default with accessible names", () => {
    renderFooter()
    const list = screen.getByRole("list", { name: "Monark on social media" })
    expect(within(list).getAllByRole("link")).toHaveLength(5)
    expect(within(list).getByRole("link", { name: "Monark on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/monark-community"
    )
  })

  it("hides socials with an empty list", () => {
    renderFooter({ socials: [] })
    expect(screen.queryByRole("list", { name: "Monark on social media" })).toBeNull()
  })

  it("links the Monark logo home and shows the built-by line", () => {
    renderFooter({ labels: { builtBy: "Acme is built by Monark" } })
    expect(screen.getByText("Acme is built by Monark")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Monark home page" })).toHaveAttribute(
      "href",
      "https://www.monark.io"
    )
  })

  it("uses the official Monark logo (wordmark in the artwork, not set in text) by default", () => {
    renderFooter()
    const link = screen.getByRole("link", { name: "Monark home page" })
    const logo = link.querySelector("[data-slot='monark-logo']")
    expect(logo).not.toBeNull()
    expect(link.querySelector("[data-slot='monark-mark']")).toBeNull()
    expect(link.querySelector("span")).toBeNull()
  })

  it("replaces the default logo with monarkLogo", () => {
    renderFooter({ monarkLogo: <img src="/monark.svg" alt="" data-testid="custom-logo" /> })
    const link = screen.getByRole("link", { name: "Monark home page" })
    expect(within(link).getByTestId("custom-logo")).toBeInTheDocument()
    expect(link.querySelector("[data-slot='monark-logo']")).toBeNull()
  })

  it("renders the legal band with the demo notice and credits", () => {
    renderFooter()
    expect(screen.getByText("© 2026 Monark · Open source")).toBeInTheDocument()
    expect(screen.getByText("Demo · simulated data")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Photo credits" })).toHaveAttribute("href", "/en/credits")
  })

  it("drops the demo notice when it is null", () => {
    renderFooter({ demoNotice: null })
    expect(screen.queryByText("Demo · simulated data")).toBeNull()
  })

  it("renders extra product-band content", () => {
    renderFooter({ children: <p>Related products</p> })
    expect(screen.getByText("Related products")).toBeInTheDocument()
  })
})
