// @vitest-environment node
import fs from "fs"
import path from "path"
import { describe, it, expect } from "vitest"

import {
  checkRegistry,
  extractImports,
  packageNameOfDependency,
  type Registry,
} from "../../../scripts/lib/registry-deps"

const ROOT = path.resolve(__dirname, "../../..")

function readRepoFile(file: string) {
  const abs = path.join(ROOT, file)
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : undefined
}

describe("registry.json", () => {
  const registry = JSON.parse(
    fs.readFileSync(path.join(ROOT, "registry.json"), "utf-8")
  ) as Registry

  it("declares every dependency its items import", () => {
    expect(checkRegistry(registry, readRepoFile)).toEqual([])
  })

  it("ships the wallet item that connect-wallet depends on", () => {
    const wallet = registry.items.find((item) => item.name === "wallet")
    expect(wallet?.files?.map((f) => f.path)).toEqual(["components/ui/wallet.tsx"])
    const connect = registry.items.find((item) => item.name === "connect-wallet")
    expect(connect?.registryDependencies).toContain("@monark/wallet")
  })
})

describe("checkRegistry", () => {
  const files: Record<string, string> = {
    "components/ui/button.tsx": `
      import { Slot } from "@radix-ui/react-slot"
      import { cva } from "class-variance-authority"
      import { cn } from "@/lib/utils"
    `,
    "components/ui/wallet.tsx": `
      import * as React from "react"
      import { CopyIcon } from "lucide-react"
      import { Button } from "@/components/ui/button"
    `,
    "components/ui/connect-wallet.tsx": `
      import { Button } from "@/components/ui/button"
      import { WalletAvatar } from "@/components/ui/wallet"
      import { cva } from "class-variance-authority"
    `,
  }
  const read = (file: string) => files[file]
  const item = (
    name: string,
    dependencies: string[],
    registryDependencies: string[] = []
  ) => ({
    name,
    dependencies,
    registryDependencies,
    files: [{ path: `components/ui/${name}.tsx` }],
  })
  const valid = (): Registry => ({
    items: [
      item("button", ["@radix-ui/react-slot", "class-variance-authority"]),
      item("wallet", ["lucide-react"], ["@monark/button"]),
      item("connect-wallet", [], ["@monark/button", "@monark/wallet"]),
    ],
  })

  it("accepts npm deps that arrive through a registry dependency", () => {
    // connect-wallet imports cva without declaring it; button declares it.
    expect(checkRegistry(valid(), read)).toEqual([])
  })

  it("rejects a bare registry dependency", () => {
    const registry = valid()
    registry.items[2].registryDependencies = ["@monark/button", "wallet"]
    const errors = checkRegistry(registry, read)
    expect(errors.some((e) => e.includes(`"wallet" is not namespaced`))).toBe(true)
  })

  it("rejects a registry dependency that does not exist", () => {
    const registry = valid()
    registry.items[2].registryDependencies!.push("@monark/nope")
    expect(checkRegistry(registry, read)).toEqual([
      `registry item "connect-wallet": registryDependency "@monark/nope" does not match any item in registry.json`,
    ])
  })

  it("rejects an npm import missing from dependencies", () => {
    const registry = valid()
    registry.items[0].dependencies = ["@radix-ui/react-slot"]
    const errors = checkRegistry(registry, read)
    expect(errors).toContain(
      `registry item "button": components/ui/button.tsx imports "class-variance-authority" but it is not in the dependencies of the item or of its registryDependencies`
    )
  })

  it("rejects an import of another item that is not a registry dependency", () => {
    const registry = valid()
    registry.items[2].registryDependencies = ["@monark/button"]
    const errors = checkRegistry(registry, read)
    expect(errors).toContain(
      `registry item "connect-wallet": components/ui/connect-wallet.tsx imports "@/components/ui/wallet" but registryDependencies does not list "@monark/wallet"`
    )
  })

  it("rejects relative imports that leave the item", () => {
    const errors = checkRegistry(
      { items: [item("button", ["@radix-ui/react-slot", "class-variance-authority"]), item("card", [])] },
      (file) =>
        file === "components/ui/card.tsx"
          ? `import { Button } from "./button"`
          : files[file]
    )
    expect(errors[0]).toMatch(/imports "\.\/button" by relative path/)
  })

  it("reports missing files", () => {
    const registry = valid()
    registry.items[0].files = [{ path: "components/ui/gone.tsx" }]
    expect(checkRegistry(registry, read)).toContain(
      `registry item "button": file "components/ui/gone.tsx" does not exist`
    )
  })
})

describe("helpers", () => {
  it("strips versions from dependency specs", () => {
    expect(packageNameOfDependency("recharts@2.15.4")).toBe("recharts")
    expect(packageNameOfDependency("react-day-picker@^9")).toBe("react-day-picker")
    expect(packageNameOfDependency("@radix-ui/react-slot@1.2.0")).toBe("@radix-ui/react-slot")
    expect(packageNameOfDependency("@radix-ui/react-slot")).toBe("@radix-ui/react-slot")
  })

  it("finds type, side-effect, re-export and dynamic imports but not comments", () => {
    const source = `
      import type { A } from "a"
      import { type B } from "b"
      import "c"
      export { D } from "d"
      const e = await import("e")
      // import { F } from "f"
      /* import { G } from "g" */
      const url = "https://example.com"
    `
    expect(extractImports(source).sort()).toEqual(["a", "b", "c", "d", "e"])
  })
})
