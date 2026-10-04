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
