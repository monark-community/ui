import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { AppLoading } from "@/components/ui/app-loading"

describe("AppLoading", () => {
  it("is a polite status region named by its label", () => {
    render(<AppLoading label="Loading your books…" />)
    const status = screen.getByRole("status")
    expect(status).toHaveAttribute("aria-live", "polite")
    expect(status).toHaveTextContent("Loading your books…")
  })

  it("renders four stats and two panels by default", () => {
    const { container } = render(<AppLoading />)
    expect(container.querySelectorAll('[data-slot="app-loading-stat"]')).toHaveLength(4)
    expect(container.querySelectorAll('[data-slot="app-loading-panel"]')).toHaveLength(2)
  })

  it("adjusts the stat and panel counts", () => {
    const { container } = render(<AppLoading stats={0} panels={1} />)
    expect(container.querySelector('[data-slot="app-loading-stats"]')).toBeNull()
    expect(container.querySelectorAll('[data-slot="app-loading-panel"]')).toHaveLength(1)
  })

  it("replaces the body with custom children, keeping the label", () => {
    const { container } = render(
      <AppLoading label="Loading">
        <div data-testid="custom" />
      </AppLoading>
    )
    expect(screen.getByTestId("custom")).toBeInTheDocument()
    expect(container.querySelector('[data-slot="app-loading-title"]')).toBeNull()
    expect(screen.getByRole("status")).toHaveTextContent("Loading")
  })
})
