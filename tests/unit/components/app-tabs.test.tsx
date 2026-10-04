import * as React from "react"
import { describe, it, expect } from "vitest"
import { render, screen, within } from "@testing-library/react"
import { AppTabs, type AppTab } from "@/components/ui/app-tabs"

const tabs: AppTab[] = [
  { href: "/en/app", label: "Ledger", exact: true, count: 3, countLabel: "3 to review" },
  { href: "/en/app/report", label: "Report" },
  { href: "/en/app/settings", label: "Settings" },
]

describe("AppTabs", () => {
  it("renders a labelled nav with one link per tab", () => {
    render(<AppTabs tabs={tabs} pathname="/en/app" />)
    const nav = screen.getByRole("navigation", { name: "App sections" })
    expect(within(nav).getAllByRole("link")).toHaveLength(3)
  })

  it("marks the exact root tab active only on its own path", () => {
    render(<AppTabs tabs={tabs} pathname="/en/app" />)
    expect(screen.getByRole("link", { name: /Ledger/ })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: "Report" })).not.toHaveAttribute("aria-current")
  })

  it("marks a section tab active on nested pages", () => {
    render(<AppTabs tabs={tabs} pathname="/en/app/report/q3" />)
    expect(screen.getByRole("link", { name: "Report" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("link", { name: /Ledger/ })).not.toHaveAttribute("aria-current")
  })

  it("does not treat a shared prefix as a parent path", () => {
    render(<AppTabs tabs={tabs} pathname="/en/app/reports" />)
    expect(screen.getByRole("link", { name: "Report" })).not.toHaveAttribute("aria-current")
  })

  it("honours an explicit active override", () => {
    render(
      <AppTabs
        tabs={[...tabs, { href: "/en/app/new", label: "New", active: true }]}
        pathname="/en/elsewhere"
      />
    )
    expect(screen.getByRole("link", { name: "New" })).toHaveAttribute("aria-current", "page")
  })

  it("announces the count with its label", () => {
    render(<AppTabs tabs={tabs} pathname="/en/app" />)
    expect(screen.getByRole("link", { name: "Ledger (3 to review)" })).toBeInTheDocument()
  })

  it("uses the LinkComponent, a custom label and renders actions", () => {
    function TestLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
      return <a data-test-link="" {...props} />
    }
    render(
      <AppTabs
        tabs={tabs}
        pathname="/en/app"
        label="Sections de l’app"
        LinkComponent={TestLink}
        actions={<button type="button">Demo controls</button>}
      />
    )
    expect(screen.getByRole("navigation", { name: "Sections de l’app" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Report" })).toHaveAttribute("data-test-link")
    expect(screen.getByRole("button", { name: "Demo controls" })).toBeInTheDocument()
  })
})
