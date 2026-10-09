import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { SiteHeader, type SiteNavLink } from "@/components/ui/site-header"

const links: SiteNavLink[] = [
  { href: "/en", label: "Overview", exact: true },
  { href: "/en/how-it-works", label: "How it works" },
  { href: "/en/faq", label: "FAQ" },
]

function renderHeader(pathname = "/en/how-it-works/fees") {
  return render(
    <SiteHeader
      brand={<a href="/en">Acme</a>}
      links={links}
      pathname={pathname}
      actions={<button type="button">Open the app</button>}
    />
  )
}

describe("SiteHeader", () => {
  it("renders a banner landmark with the brand, links and actions", () => {
    renderHeader()
    const header = screen.getByRole("banner")
    expect(within(header).getByRole("link", { name: "Acme" })).toBeInTheDocument()
    expect(within(header).getByRole("navigation", { name: "Main" })).toBeInTheDocument()
    expect(within(header).getByRole("button", { name: "Open the app" })).toBeInTheDocument()
  })

  it("marks the section link active on nested pages", () => {
    renderHeader("/en/how-it-works/fees")
    expect(screen.getByRole("link", { name: "How it works" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current")
  })

  it("marks an exact link active only on its own path", () => {
    renderHeader("/en")
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "FAQ" })).not.toHaveAttribute("aria-current")
  })

  it("does not treat a shared prefix as a parent path", () => {
    renderHeader("/en/faq-archive")
    expect(screen.getByRole("link", { name: "FAQ" })).not.toHaveAttribute("aria-current")
  })

  it("opens the mobile sheet with the links and actions, and closes it", async () => {
    renderHeader()
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const sheet = screen.getByRole("dialog", { name: "Menu" })
    expect(within(sheet).getByRole("link", { name: "FAQ" })).toBeInTheDocument()
    expect(within(sheet).getByRole("button", { name: "Open the app" })).toBeInTheDocument()
    await userEvent.click(within(sheet).getByRole("button", { name: "Close menu" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("closes the sheet when a link inside it is followed", async () => {
    renderHeader()
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const sheet = screen.getByRole("dialog")
    const faq = within(sheet).getByRole("link", { name: "FAQ" })
    faq.addEventListener("click", (event) => event.preventDefault())
    await userEvent.click(faq)
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("uses mobileActions in the sheet when given", async () => {
    render(
      <SiteHeader
        brand={<span>Acme</span>}
        actions={<span>desktop-only</span>}
        mobileActions={<span>mobile-only</span>}
      />
    )
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const sheet = screen.getByRole("dialog")
    expect(within(sheet).getByText("mobile-only")).toBeInTheDocument()
    expect(within(sheet).queryByText("desktop-only")).toBeNull()
  })

  it("accepts translated labels", async () => {
    render(
      <SiteHeader
        brand={<span>Acme</span>}
        links={links}
        labels={{ nav: "Principal", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", menu: "Menu" }}
      />
    )
    expect(screen.getByRole("navigation", { name: "Principal" })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Ouvrir le menu" }))
    expect(screen.getByRole("button", { name: "Fermer le menu" })).toBeInTheDocument()
  })
})
