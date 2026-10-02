import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const setTheme = vi.fn()
let resolvedTheme = "light"

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme, setTheme }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}))

import { ThemeToggle } from "@/components/ui/theme-toggle"

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockClear()
  })

  it("has an accessible name, defaulting to 'Toggle theme'", () => {
    render(<ThemeToggle />)
    expect(screen.getByRole("button", { name: "Toggle theme" })).toBeInTheDocument()
  })

  it("accepts a translated label", () => {
    render(<ThemeToggle label="Changer de thème" />)
    expect(screen.getByRole("button", { name: "Changer de thème" })).toHaveAttribute("title", "Changer de thème")
  })

  it("switches light to dark", async () => {
    resolvedTheme = "light"
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole("button"))
    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("switches dark to light", async () => {
    resolvedTheme = "dark"
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole("button"))
    expect(setTheme).toHaveBeenCalledWith("light")
  })

  it("renders both icons, swapped by the dark: variant, so nothing depends on hydration", () => {
    const { container } = render(<ThemeToggle />)
    const icons = container.querySelectorAll("svg[aria-hidden='true']")
    expect(icons).toHaveLength(2)
    expect(icons[0].getAttribute("class")).toContain("dark:block")
    expect(icons[1].getAttribute("class")).toContain("dark:hidden")
  })
})
