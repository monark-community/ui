import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LocaleSwitch } from "@/components/ui/locale-switch"

const locales = ["en", "fr"] as const

describe("LocaleSwitch", () => {
  it("renders one link per locale with hrefFor's target", () => {
    render(<LocaleSwitch locales={locales} current="en" hrefFor={(l) => `/${l}/faq`} />)
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "/en/faq")
    expect(links[1]).toHaveAttribute("href", "/fr/faq")
  })

  it("shows upper-case codes by default and custom short labels when given", () => {
    const { rerender } = render(<LocaleSwitch locales={locales} current="en" hrefFor={(l) => `/${l}`} />)
    expect(screen.getByText("EN")).toBeInTheDocument()
    rerender(
      <LocaleSwitch locales={locales} current="en" hrefFor={(l) => `/${l}`} labels={{ short: { fr: "Fr" } }} />
    )
    expect(screen.getByText("Fr")).toBeInTheDocument()
  })

  it("marks only the current locale with aria-current", () => {
    render(<LocaleSwitch locales={locales} current="fr" hrefFor={(l) => `/${l}`} />)
    const [en, fr] = screen.getAllByRole("link")
    expect(en).not.toHaveAttribute("aria-current")
    expect(fr).toHaveAttribute("aria-current", "true")
  })

  it("sets lang and hreflang on each segment", () => {
    render(<LocaleSwitch locales={locales} current="en" hrefFor={(l) => `/${l}`} />)
    const fr = screen.getAllByRole("link")[1]
    expect(fr).toHaveAttribute("lang", "fr")
    expect(fr).toHaveAttribute("hreflang", "fr")
  })

  it("labels the nav and the segments", () => {
    render(
      <LocaleSwitch
        locales={locales}
        current="en"
        hrefFor={(l) => `/${l}`}
        labels={{ label: "Langue", names: { en: "English", fr: "Français" } }}
      />
    )
    expect(screen.getByRole("navigation", { name: "Langue" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Français" })).toBeInTheDocument()
  })
})
