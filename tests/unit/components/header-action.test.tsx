import * as React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { HeaderAction } from "@/components/ui/header-action"

describe("HeaderAction", () => {
  it("renders the launch link outside the app", () => {
    render(<HeaderAction appHref="/en/app" pathname="/en/how-it-works" />)
    expect(screen.getByRole("link", { name: "Launch demo" })).toHaveAttribute("href", "/en/app")
  })

  it("uses the LinkComponent and calls onNavigate", async () => {
    const onNavigate = vi.fn()
    function TestLink({
      onClick,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
      return (
        <a
          data-test-link=""
          onClick={(event) => {
            event.preventDefault()
            onClick?.(event)
          }}
          {...props}
        />
      )
    }
    render(
      <HeaderAction
        appHref="/en/app"
        pathname="/en"
        launchLabel="Lancer la démo"
        LinkComponent={TestLink}
        onNavigate={onNavigate}
      />
    )
    const link = screen.getByRole("link", { name: "Lancer la démo" })
    expect(link).toHaveAttribute("data-test-link")
    await userEvent.click(link)
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it("derives inApp from the pathname, including nested app pages", () => {
    render(<HeaderAction appHref="/en/app" pathname="/en/app/report" />)
    expect(screen.queryByRole("link")).toBeNull()
    expect(screen.getByRole("button", { name: /connect wallet/i })).toBeInTheDocument()
  })

  it("does not treat a shared prefix as the app", () => {
    render(<HeaderAction appHref="/en/app" pathname="/en/apps" />)
    expect(screen.getByRole("link", { name: "Launch demo" })).toBeInTheDocument()
  })

  it("forwards wallet props to ConnectWallet", async () => {
    const onConnect = vi.fn()
    render(<HeaderAction appHref="/en/app" inApp wallet={{ onConnect, connectLabel: "Connect" }} />)
    await userEvent.click(screen.getByRole("button", { name: "Connect" }))
    expect(onConnect).toHaveBeenCalledTimes(1)
  })

  it("renders a hidden pulse placeholder while loading in the app", () => {
    const { container } = render(<HeaderAction appHref="/en/app" inApp loading />)
    expect(screen.queryByRole("button")).toBeNull()
    const placeholder = container.querySelector('[data-slot="header-action"]')
    expect(placeholder).toHaveAttribute("aria-hidden", "true")
    expect(placeholder).toHaveClass("animate-pulse")
  })

  it("ignores loading outside the app", () => {
    render(<HeaderAction appHref="/en/app" inApp={false} loading />)
    expect(screen.getByRole("link", { name: "Launch demo" })).toBeInTheDocument()
  })
})
