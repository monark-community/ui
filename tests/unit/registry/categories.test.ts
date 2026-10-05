// @vitest-environment node
import fs from "fs"
import path from "path"
import { describe, it, expect } from "vitest"

import config from "../../../registry-shell.config"

const ROOT = path.resolve(__dirname, "../../..")

const components = fs
  .readdirSync(path.join(ROOT, "components/ui"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.replace(/\.tsx$/, ""))

const categories = (config as { categories: Record<string, string[]> })
  .categories

describe("sidebar categories", () => {
  // Anything left out lands in the shell's catch-all "Base" group, which is
  // what the grouping exists to avoid.
  it("puts every component in a group", () => {
    const grouped = new Set(Object.values(categories).flat())
    expect(components.filter((name) => !grouped.has(name))).toEqual([])
  })

  it("puts each component in only one group", () => {
    const seen = new Map<string, string>()
    const duplicates: string[] = []
    for (const [group, names] of Object.entries(categories)) {
      for (const name of names) {
        if (seen.has(name)) duplicates.push(`${name} (${seen.get(name)}, ${group})`)
        seen.set(name, group)
      }
    }
    expect(duplicates).toEqual([])
  })

  it("only lists components that exist", () => {
    const known = new Set(components)
    expect(Object.values(categories).flat().filter((name) => !known.has(name))).toEqual([])
  })
})
