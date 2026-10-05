// @vitest-environment node
import fs from "fs"
import path from "path"
import { describe, it, expect } from "vitest"

const ROOT = path.resolve(__dirname, "../../..")

type CssTree = { [key: string]: string | CssTree }

interface ThemeItem {
  name: string
  cssVars: {
    theme: Record<string, string>
    light: Record<string, string>
    dark: Record<string, string>
  }
  css: CssTree
}

const registry = JSON.parse(
  fs.readFileSync(path.join(ROOT, "registry.json"), "utf-8")
) as { items: ThemeItem[] }
const theme = registry.items.find((item) => item.name === "theme")!

describe("theme item", () => {
  // The shadcn CLI only writes `--color-<name>` into @theme inline for values
  // it recognises as colours. A token whose value is `var(--…)` gets a
  // self-referencing `--<name>: var(--<name>)` instead, so `bg-popover`,
  // `ring-ring` and friends would not exist in a fresh install.
  it("maps every colour token to a Tailwind colour explicitly", () => {
    const tokens = Object.keys(theme.cssVars.light).filter(
      (key) => key !== "surface-tint"
    )
    const missing = tokens.filter(
      (key) => theme.cssVars.theme[`color-${key}`] !== `var(--${key})`
    )
    expect(missing).toEqual([])
  })

  it("defines every dark token in light mode too", () => {
    const light = new Set(Object.keys(theme.cssVars.light))
    expect(Object.keys(theme.cssVars.dark).filter((k) => !light.has(k))).toEqual([])
  })

  it("ships the radius scale and heading font", () => {
    for (const step of ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"]) {
      expect(theme.cssVars.theme[`radius-${step}`]).toBeDefined()
    }
    expect(theme.cssVars.theme["font-heading"]).toBe("var(--font-sans)")
  })

  // `{"@apply": "x"}` is written out as `@apply: x;`, which Tailwind rejects.
  // The CLI wants the whole directive as the key: `{"@apply x": {}}`.
  it("writes @apply as a key, never as a property", () => {
    const offenders: string[] = []
    const walk = (node: CssTree, trail: string) => {
      for (const [key, value] of Object.entries(node)) {
        if (key === "@apply") offenders.push(trail)
        if (typeof value === "object") walk(value, `${trail} > ${key}`)
      }
    }
    walk(theme.css, "css")
    expect(offenders).toEqual([])
  })
})

describe("theme item imports", () => {
  // The components use shadcn's data-open / data-checked / data-horizontal
  // variants and tw-animate-css's animate-in classes. Without these imports
  // tabs, sliders, checkboxes and every overlay render half-styled.
  it("brings in tw-animate-css and shadcn/tailwind.css", () => {
    expect(Object.keys(theme.css)).toEqual(
      expect.arrayContaining(['@import "tw-animate-css"', '@import "shadcn/tailwind.css"'])
    )
    expect((theme as unknown as { dependencies: string[] }).dependencies).toEqual(
      expect.arrayContaining(["shadcn", "tw-animate-css"])
    )
  })
})

describe("theme item motion and cursor", () => {
  const siteCss = fs.readFileSync(path.join(ROOT, "styles/theme.css"), "utf-8")
  const flat = (css: string) => css.replace(/\s+/g, " ")

  // Accordion, Collapsible and Disclosure panels put animate-expand on the
  // element Radix gives data-state, so a fresh install needs the utility.
  it("ships the animate-expand utility", () => {
    const expand = theme.css["@utility animate-expand"] as CssTree
    expect(expand).toBeDefined()
    expect(expand.overflow).toBe("clip")
    expect(expand["overflow-clip-margin"]).toBe("4px")
    expect(expand["&[data-state=open]"]).toEqual({
      animation: "var(--animate-collapsible-down)",
    })
    expect(expand["&[data-state=closed]"]).toEqual({
      animation: "var(--animate-collapsible-up)",
    })
    const reduced = theme.css["@media (prefers-reduced-motion: reduce)"] as CssTree
    expect(reduced[".animate-expand"]).toEqual({ animation: "none !important" })
  })

  it("keeps the docs site's theme.css in sync for animate-expand", () => {
    const css = flat(siteCss)
    expect(css).toContain("@utility animate-expand { overflow: clip; overflow-clip-margin: 4px;")
    expect(css).toContain("&[data-state=open] { animation: var(--animate-collapsible-down); }")
    expect(css).toContain("&[data-state=closed] { animation: var(--animate-collapsible-up); }")
    expect(css).toContain(".animate-expand { animation: none !important; }")
  })

  // shadcn v4 dropped pointer cursors; Monark wants them on every control.
  it("puts a pointer on enabled controls and not-allowed on disabled ones", () => {
    const base = theme.css["@layer base"] as CssTree
    const pointer = Object.entries(base).find(
      ([, rule]) => typeof rule === "object" && rule.cursor === "pointer"
    )
    const disabled = Object.entries(base).find(
      ([, rule]) => typeof rule === "object" && rule.cursor === "not-allowed"
    )
    expect(pointer).toBeDefined()
    expect(disabled).toBeDefined()
    const [pointerSelector] = pointer!
    const [disabledSelector] = disabled!
    // Zero specificity, so a cursor-* class on a component still wins.
    expect(pointerSelector.startsWith(":where(")).toBe(true)
    expect(disabledSelector.startsWith(":where(")).toBe(true)
    for (const target of [
      "button",
      "[role=button]",
      "[role=checkbox]",
      "[role=switch]",
      "[role=radio]",
      "[role=tab]",
      "[role=option]",
      "[role=menuitem]",
      "[role=menuitemcheckbox]",
      "[role=menuitemradio]",
      "[role=combobox]",
      "select",
      "summary",
      "label[for]",
      "input[type=checkbox]",
      "input[type=radio]",
      "input[type=range]",
      "input[type=file]",
      "input[type=color]",
    ]) {
      expect(pointerSelector).toContain(target)
    }
    for (const target of [":disabled", "[aria-disabled=true]", "[data-disabled]"]) {
      expect(disabledSelector).toContain(target)
    }

    const css = flat(siteCss)
    expect(css).toContain(`${pointerSelector} { cursor: pointer; }`)
    expect(css).toContain(`${disabledSelector} { cursor: not-allowed; }`)
  })
})

// WCAG 1.4.11: chart marks need 3:1 against what they sit on. Checks the
// fixed (hex) light/dark values; chart-1 in dark mode is var(--primary).
describe("theme item chart contrast", () => {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }
  const resolve = (mode: "light" | "dark", key: string) => {
    const value = theme.cssVars[mode][key] ?? theme.cssVars.light[key]
    return value === "var(--primary)" ? resolve(mode, "primary") : value
  }

  for (const mode of ["light", "dark"] as const) {
    it(`keeps every ${mode} chart colour at 3:1 on the background and cards`, () => {
      const surfaces = [resolve(mode, "background"), resolve(mode, "card")]
      const failing: string[] = []
      for (let i = 1; i <= 5; i++) {
        const color = resolve(mode, `chart-${i}`)
        if (!/^#[0-9a-f]{6}$/i.test(color)) continue
        for (const surface of surfaces) {
          const ratio = contrast(color, surface)
          if (ratio < 3) failing.push(`chart-${i} ${color} on ${surface}: ${ratio.toFixed(2)}`)
        }
      }
      expect(failing).toEqual([])
    })
  }
})
